import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { AddEventPage } from '../add-event/add-event.page';
import { CalendarComponent } from 'ionic2-calendar';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild(CalendarComponent, null) myCalendar: CalendarComponent;

  currentPage = 'first';
  eventSource = [];
  events = [];
  displayEvents = [];
  nearEvent = [];
  selectedEvents = [];
  total = 0;
  viewTitle;
  accMonth;
  calendar = {
    mode: 'month',
    currentDate: new Date(),
  };
  calendarSecond = {
    mode: 'week',
    currentDate: new Date(),
  };
  selectedDate: Date;

  constructor(
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    const events = localStorage.getItem('eventSource') ? JSON.parse(localStorage.getItem('eventSource')) : [];
    events.forEach((event) => {
      event.startTime = new Date(event.startTime);
      event.endTime = new Date(event.endTime);
      this.eventSource.push(event);
    });
    setTimeout(() => {
      this.myCalendar.loadEvents();
    }, 500);
  }

  page(currentPage) {
    this.currentPage = currentPage;
  }

  onCurrentDateChanged(currentEvent: Date) {
    this.selectedDate = currentEvent;
    this.displayEvents = [];
    this.nearEvent = [];

    this.eventSource.forEach((event) => {
      const currentDate = new Date(currentEvent).toDateString();
      const eachDate = new Date(event.startTime).toDateString();
      event.timestamp = event.startTime.getTime();
      if (currentDate === eachDate) {
        this.displayEvents.push(event);
      }
    });
    if (this.displayEvents.length > 0) {
      this.total = this.displayEvents.length;
      this.displayEvents = this.displayEvents.sort((a, b) => a.timestamp - b.timestamp);

      const minTimes = [];
      this.displayEvents.forEach((event) => {
        const currentTime = new Date().getTime();
        if (event.timestamp > currentTime) {
          minTimes.push(event.startTime.getTime());
        }
      });
      const nearTime = minTimes.sort((a, b) => a - b);
      this.nearEvent = this.displayEvents.filter((event) => event.timestamp === nearTime[0]);
      if (this.nearEvent.length > 0) {
        this.displayEvents = this.displayEvents.filter(event => event.timestamp !== this.nearEvent[0].timestamp);
      }
    }
    this.filterEvents();
  }

  changeMode(mode) {
    this.calendar.mode = mode;
  }

  today() {
    this.calendar.currentDate = new Date();
  }

  async addEvent() {
    const modal = await this.modalCtrl.create({
      component: AddEventPage,
      cssClass: 'cal-modal',
      backdropDismiss: true
    });
    await modal.present();
    modal.onDidDismiss().then((result) => {
      if (result.data && result.data.event) {
        const event = result.data.event;
        this.eventSource.push(event);
        localStorage.setItem('eventSource', JSON.stringify(this.eventSource));
        this.onCurrentDateChanged(event.startTime);
      }
    });
  }

  filterEvents() {
    this.selectedEvents = [];
    this.eventSource.forEach((event) => {
      if (event.startTime.toLocaleDateString() === new Date(this.accMonth).toLocaleDateString()) {
        this.selectedEvents.push(event);
      }
    });
    this.selectedEvents.sort((a, b) => a.timestamp - b.timestamp);
  }

}
