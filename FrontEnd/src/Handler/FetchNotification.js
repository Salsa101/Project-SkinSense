import api from '../api';
import { notification } from './Notification';

export const fetchAndScheduleNotifications = async () => {
  try {
    const profileRes = await api.get('/profile/view');

    console.log('HASIL PROFIL:', profileRes.data);
    console.log('enabledNotif:', profileRes.data?.user?.enabledNotif);

    const enabled = profileRes.data?.user?.enabledNotif;

    if (!enabled) {
      console.log('🔕 Notifikasi OFF');
      notification.cancelAllNotifications();
      return;
    }

    notification.cancelAllNotifications();

    // === Reminder morning/night ===
    const reminderRes = await api.get('/reminder-times/notif');
    console.log('Reminder response:', reminderRes.data);

    if (reminderRes.data && reminderRes.data.length > 0) {
      reminderRes.data.forEach(rem => {
        if (!rem.reminderTime) return;

        const [hours, minutes, seconds] = rem.reminderTime.split(':');
        let time = new Date();
        time.setHours(
          parseInt(hours),
          parseInt(minutes),
          parseInt(seconds || 0),
          0,
        );

        const now = new Date();
        console.log(now.toString());
        if (time <= now) time.setDate(time.getDate() + 1);

        console.log(`Scheduling ${rem.timeOfDay} reminder at`, time.toString());
        notification.buatChannel(`${rem.id}`);

        const timeOfDayCap =
          rem.timeOfDay.charAt(0).toUpperCase() + rem.timeOfDay.slice(1);

        const emoji = rem.timeOfDay === 'morning' ? '🌞' : '🌙';

        notification.kirimNotifikasiJadwal(
          `${rem.id}`,
          `${timeOfDayCap} Skincare`,
          `It's time for ${rem.timeOfDay} skincare ${emoji}`,
          time,
        );
      });
    }

    // === Reminder siang (sunscreen) ===
    const now = new Date();
    const sunscreenTime = new Date();
    sunscreenTime.setHours(12, 0, 0, 0); // jam 12 siang

    if (sunscreenTime <= now)
      sunscreenTime.setDate(sunscreenTime.getDate() + 1);

    notification.buatChannel('sunscreen-reminder');

    notification.kirimNotifikasiJadwal(
      '☀️ Sunscreen Reminder',
      "Don't forget to use your sunscreen again.!",
      sunscreenTime,
    );

    // === Produk hampir expired ===
    const expRes = await api.get('/expiry-product/notif');
    console.log('Expired product response:', expRes.data);

    if (expRes.data && expRes.data.length > 0) {
      const productNames = expRes.data.map(p => p.Product.productName);

      // get the nearest expiration date
      const earliestExp = expRes.data.reduce((earliest, p) => {
        const d = new Date(p.expirationDate);
        return !earliest || d < earliest ? d : earliest;
      }, null);

      const formattedDate = earliestExp.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
      });

      const message = `${productNames.join(
        ', ',
      )} will expire on ${formattedDate}`;

      const time = new Date();
      time.setHours(9, 0, 0, 0);

      if (time <= new Date()) time.setDate(time.getDate() + 1);

      notification.buatChannel('expired-product');

      notification.kirimNotifikasiExpiredHarian(
        '⚠️ Products Almost Expired',
        message,
        time,
      );
    }

    notification.cekSemuaNotifikasi();
  } catch (err) {
    console.error('Gagal ambil data notifikasi:', err);
  }
};
