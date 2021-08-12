import { Component } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { CalendarMode, Step } from 'ionic2-calendar/calendar';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.page.html',
  styleUrls: ['./add-event.page.scss'],
})
export class AddEventPage {

  calendar = {
    mode: 'month' as CalendarMode,
    step: 30 as Step,
    currentDate: new Date()
  };
  isToday: boolean;
  viewTitle: string;
  modalReady = false;
  eventTime = new Date().toISOString();
  event = {
    title: '',
    desc: '',
    startTime: null,
    endTime: null,
    allDay: false
  };

  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) {
    setTimeout(() => {
      this.modalReady = true;
    }, 500);
  }

  async saveEvent() {
    if (this.event.title && this.event.desc) {
      const selectedTime = new Date(this.eventTime).toTimeString().split(':');
      this.event.startTime = new Date(
        this.event.startTime.getFullYear(),
        this.event.startTime.getMonth(),
        this.event.startTime.getDate(),
        Number(selectedTime[0]),
        Number(selectedTime[1]),
        this.event.startTime.getSeconds(),
      );
      this.modalCtrl.dismiss({ event: this.event });
    } else {
      const toast = await this.toastCtrl.create({
        message: 'Enter Title and Description',
        duration: 800,
      });
      toast.present();
      this.modalCtrl.dismiss();
    }
  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  onCurrentDateChanged(date) {
    const startTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      0,
      0,
      0
    );
    const endTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      23,
      59,
      59
    );
    this.event.startTime = startTime;
    this.event.endTime = endTime;
  }
}
