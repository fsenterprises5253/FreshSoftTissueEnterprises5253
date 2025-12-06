import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ModernRangePicker({
  value,
  onChange,
  label,
  portalContainer,   // ✅ ADDED
}: any) {
  const [open, setOpen] = useState(false);
  const [tempRange, setTempRange] = useState(
    value || { from: undefined, to: undefined }
  );

  const [tempMonth, setTempMonth] = useState(
    tempRange?.from || new Date()
  );

  return (
    <div className="flex flex-col">
      {label && <label className="text-xs mb-1">{label}</label>}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[220px] justify-start text-left text-black hover:text-black bg-white hover:bg-slate-100 flex items-center gap-2 font-normal"
          >
            <CalendarIcon className="w-4 h-4" />
            {value?.from && value?.to
              ? `${format(value.from, "dd/MM/yyyy")} → ${format(
                  value.to,
                  "dd/MM/yyyy"
                )}`
              : "Select date range"}
          </Button>
        </PopoverTrigger>

        {/* === FIX: Use PopoverPortal with container === */}
        <PopoverPrimitive.Portal container={portalContainer}>
          <PopoverContent
            side="bottom"
            align="start"
            className="p-4 w-[320px] rounded-2xl shadow-xl border bg-white space-y-3 z-[99999]"
          >

            <Calendar
              mode="range"
              selected={tempRange}
              onSelect={setTempRange}
              numberOfMonths={1}
              month={tempMonth}
              onMonthChange={setTempMonth}
              className="rounded-md bg-slate-50"
              components={{
                Caption: () => (
                  <div className="flex items-center justify-between px-3 py-2">
                    {/* PREV BUTTON */}
                    <button
                      onClick={() => {
                        const d = new Date(tempMonth);
                        d.setMonth(d.getMonth() - 1);
                        setTempMonth(d);
                      }}
                      className="p-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white shadow transition"
                    >
                      <ChevronLeft className="w-3 h-3" />
                    </button>

                    {/* MONTH + YEAR DROPDOWN */}
                    <div className="flex items-center gap-2">
                      <select
                        className="bg-transparent text-base font-medium focus:outline-none"
                        value={tempMonth.getMonth()}
                        onChange={(e) => {
                          const d = new Date(tempMonth);
                          d.setMonth(Number(e.target.value));
                          setTempMonth(d);
                        }}
                      >
                        {Array.from({ length: 12 }).map((_, idx) => (
                          <option key={idx} value={idx}>
                            {new Date(2000, idx, 1).toLocaleString("en-US", {
                              month: "long",
                            })}
                          </option>
                        ))}
                      </select>

                      <select
                        className="bg-transparent text-base font-medium focus:outline-none"
                        value={tempMonth.getFullYear()}
                        onChange={(e) => {
                          const d = new Date(tempMonth);
                          d.setFullYear(Number(e.target.value));
                          setTempMonth(d);
                        }}
                      >
                        {Array.from({ length: 50 }).map((_, idx) => {
                          const year = 2000 + idx;
                          return (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    {/* NEXT BUTTON */}
                    <button
                      onClick={() => {
                        const d = new Date(tempMonth);
                        d.setMonth(d.getMonth() + 1);
                        setTempMonth(d);
                      }}
                      className="p-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white shadow transition"
                    >
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                ),
              }}
            />

            <div className="flex justify-between pt-1">
              <button className="text-black bg-slate-300 hover:bg-slate-400 rounded-lg w-20 h-8 text-sm" onClick={() => setOpen(false)}>
                Cancel
              </button>

              <button
                className="text-gray-700 bg-cyan-300 hover:bg-cyan-400 rounded-lg w-20 h-8 font-semibold text-sm"
                onClick={() => {
                  onChange(tempRange);
                  setOpen(false);
                }}
              >
                Confirm
              </button>
            </div>
          </PopoverContent>
        </PopoverPrimitive.Portal>
      </Popover>
    </div>
  );
}
