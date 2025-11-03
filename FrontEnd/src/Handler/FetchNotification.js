import api from '../api';
import { notification } from './Notification';

export const fetchAndScheduleNotifications = async () => {
  try {
    // === Reminder morning/night ===
    const reminderRes = await api.get('/reminder-times/notif');
    console.log('Reminder response:', reminderRes.data);

    if (reminderRes.data) {
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
        notification.kirimNotifikasiJadwal(
          `${rem.id}`,
          `Skincare ${rem.timeOfDay}`,
          `Waktunya skincare ${rem.timeOfDay}! 💧`,
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
        } akan kedaluwarsa pada ${expDate.toDateString()}`;
        console.log('Sending notification for expired:', pesan);

        notification.kirimNotifikasi(
          `${p.id}`,
          'Produk hampir kedaluwarsa ⚠️',
          pesan,
        );
      });
    }
  } catch (err) {
    console.error('Gagal ambil data notifikasi:', err);
  }
};
