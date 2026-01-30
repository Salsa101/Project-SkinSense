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

    // === Produk hampir expired ===
    const expRes = await api.get('/expiry-product/notif');
    console.log('Expired product response:', expRes.data);

    if (expRes.data) {
      expRes.data.forEach(p => {
        const expDate = new Date(p.expirationDate);
        const pesan = `${
          p.Product.productName
        } will expire on ${expDate.toDateString()}`;
        console.log('Sending notification for expired:', pesan);

        notification.kirimNotifikasi(
          `${p.id}`,
          'Product is almost expired ⚠️',
          pesan,
        );
      });
    }

    notification.cekSemuaNotifikasi();
  } catch (err) {
    console.error('Gagal ambil data notifikasi:', err);
  }
};
