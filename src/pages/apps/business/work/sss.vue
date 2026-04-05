<script setup lang="ts">
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { DayCellContentArg, EventContentArg } from "@fullcalendar/core";

// Màu theo trạng thái
const getColor = (status: string) => {
  switch (status) {
    case "Đúng giờ":
      return "#d1e7dd"; // xanh nhạt
    case "Muộn":
      return "#fff3cd"; // vàng
    case "Vắng":
      return "#f8d7da"; // đỏ nhạt
    default:
      return "#e2e3e5"; // xám
  }
};

// Dữ liệu mẫu
const workShiftData = [
  {
    date: "2025-08-11",
    shift: "Sáng",
    status: "Đúng giờ",
    checkIn: "08:05",
    checkOut: "11:55",
  },
  {
    date: "2025-08-12",
    shift: "Sáng",
    status: "Muộn",
    checkIn: "08:25",
    checkOut: "12:00",
  },
  {
    date: "2025-08-13",
    shift: "Sáng",
    status: "Vắng",
    checkIn: null,
    checkOut: null,
  },
];

// Map sang events
const events = workShiftData.map((d) => ({
  title: `${d.shift}: ${d.checkIn ? `${d.checkIn} - ${d.checkOut}` : d.status}`,
  start: `${d.date}T08:00:00`,
  display: "background",
  backgroundColor: getColor(d.status),
}));

const calendarOptions = {
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: "dayGridMonth",
  headerToolbar: {
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth,timeGridWeek,timeGridDay",
  },
  events,
  dayCellContent(info: DayCellContentArg) {
    return {
      html: `<div style="font-weight:bold">${info.dayNumberText}</div>`,
    };
  },
  eventContent(info: EventContentArg) {
    return {
      html: `<div style="padding:2px;font-size:12px;">${info.event.title}</div>`,
    };
  },
};
</script>

<template>
  <div style="max-width: 1000px; margin: auto">
    <FullCalendar :options="calendarOptions" />
  </div>
</template>

<style>
.fc-daygrid-day-bg .fc-bg-event {
  opacity: 0.5;
}
</style>
