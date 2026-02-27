"use client";

import { useState } from "react";
import { saleEvents, SaleEvent } from "@/data/sales-calendar";
import { beers } from "@/data/beers";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Monday = 0
}

function formatDate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function SalesCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1)); // March 2026
  const [selectedEvent, setSelectedEvent] = useState<SaleEvent | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getEventForDay = (day: number): SaleEvent | undefined => {
    const dateStr = formatDate(year, month, day);
    return saleEvents.find((e) => e.date === dateStr);
  };

  const getBeerForEvent = (event: SaleEvent) => {
    return beers.find((b) => b.id === event.beerId);
  };

  const hasActiveSale = saleEvents.some((e) => e.status === "active");

  return (
    <div>
      {/* Status badge */}
      <div className="mb-6 flex items-center gap-2">
        <div
          className={`w-2.5 h-2.5 rounded-full ${
            hasActiveSale ? "bg-green-500 animate-pulse" : "bg-charcoal/30"
          }`}
        ></div>
        <span className="text-sm font-medium">
          {hasActiveSale ? "Sale Active" : "No Active Sale"}
        </span>
      </div>

      {/* Calendar header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-charcoal/5 rounded transition-colors"
          aria-label="Previous month"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="font-serif text-xl">
          {MONTHS[month]} {year}
        </h3>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-charcoal/5 rounded transition-colors"
          aria-label="Next month"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAYS.map((day) => (
          <div
            key={day}
            className="text-center text-xs uppercase tracking-widest text-charcoal/50 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells before first day */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="h-14"></div>
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const event = getEventForDay(day);
          const beer = event ? getBeerForEvent(event) : null;

          return (
            <button
              key={day}
              onClick={() => event && setSelectedEvent(event)}
              className={`h-14 rounded-lg text-sm flex flex-col items-center justify-center gap-1 transition-colors ${
                event
                  ? "hover:bg-charcoal/5 cursor-pointer"
                  : "cursor-default"
              }`}
            >
              <span className={event ? "font-medium" : "text-charcoal/50"}>
                {day}
              </span>
              {beer && (
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: beer.color }}
                  title={beer.name}
                ></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-4 text-xs text-charcoal/60">
        {beers.map((beer) => (
          <div key={beer.id} className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: beer.color }}
            ></div>
            <span>{beer.name}</span>
          </div>
        ))}
      </div>

      {/* Selected event detail */}
      {selectedEvent && (
        <div className="mt-6 p-4 bg-white rounded-lg border border-charcoal/10">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-serif text-lg">
                {getBeerForEvent(selectedEvent)?.name}
              </h4>
              <p className="text-sm text-charcoal/60 mt-1">
                {new Date(selectedEvent.date + "T00:00:00").toLocaleDateString("en-IE", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-sm text-charcoal/60">
                Time: {selectedEvent.timeWindow}
              </p>
              <span
                className={`inline-block mt-2 text-xs px-2 py-1 rounded ${
                  selectedEvent.status === "active"
                    ? "bg-green-100 text-green-800"
                    : selectedEvent.status === "completed"
                    ? "bg-charcoal/10 text-charcoal/50"
                    : "bg-amber/10 text-amber"
                }`}
              >
                {selectedEvent.status.charAt(0).toUpperCase() +
                  selectedEvent.status.slice(1)}
              </span>
            </div>
            <button
              onClick={() => setSelectedEvent(null)}
              className="text-charcoal/40 hover:text-charcoal transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
