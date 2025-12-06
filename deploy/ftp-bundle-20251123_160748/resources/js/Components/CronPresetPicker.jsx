import React from 'react';

const presets = [
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
  { id: 'custom', label: 'Custom cron' },
];

const weekDays = [
  { value: '1', label: 'Monday' },
  { value: '2', label: 'Tuesday' },
  { value: '3', label: 'Wednesday' },
  { value: '4', label: 'Thursday' },
  { value: '5', label: 'Friday' },
  { value: '6', label: 'Saturday' },
  { value: '0', label: 'Sunday' },
];

export default function CronPresetPicker({ value, onChange, error, hint }) {
  const [preset, setPreset] = React.useState('custom');
  const [time, setTime] = React.useState('20:00');
  const [weekday, setWeekday] = React.useState('1');
  const [monthday, setMonthday] = React.useState('1');
  const [customValue, setCustomValue] = React.useState(value ?? '0 20 * * *');

  React.useEffect(() => {
    if (!value) {
      return;
    }

    const matchDaily = value.match(/^(\d{1,2})\s+(\d{1,2})\s+\*\s+\*\s+\*$/);
    const matchWeekly = value.match(/^(\d{1,2})\s+(\d{1,2})\s+\*\s+\*\s+([0-6])$/);
    const matchMonthly = value.match(/^(\d{1,2})\s+(\d{1,2})\s+([1-9]|[12]\d|3[01])\s+\*\s+\*$/);

    if (matchDaily) {
      setPreset('daily');
      setTime(padTime(matchDaily[2], matchDaily[1]));
    } else if (matchWeekly) {
      setPreset('weekly');
      setWeekday(matchWeekly[3]);
      setTime(padTime(matchWeekly[2], matchWeekly[1]));
    } else if (matchMonthly) {
      setPreset('monthly');
      setMonthday(matchMonthly[3]);
      setTime(padTime(matchMonthly[2], matchMonthly[1]));
    } else {
      setPreset('custom');
      setCustomValue(value);
    }
  }, [value]);

  const handlePresetChange = (newPreset) => {
    setPreset(newPreset);
    const cron = buildCron({
      preset: newPreset,
      time,
      weekday,
      monthday,
      customValue,
    });
    onChange(cron);
  };

  const handleTimeChange = (newTime) => {
    setTime(newTime);
    if (preset === 'custom') {
      return;
    }
    const cron = buildCron({
      preset,
      time: newTime,
      weekday,
      monthday,
      customValue,
    });
    onChange(cron);
  };

  const handleWeekdayChange = (value) => {
    setWeekday(value);
    if (preset !== 'weekly') {
      return;
    }
    onChange(buildCron({ preset, time, weekday: value, monthday, customValue }));
  };

  const handleMonthdayChange = (value) => {
    setMonthday(value);
    if (preset !== 'monthly') {
      return;
    }
    onChange(buildCron({ preset, time, weekday, monthday: value, customValue }));
  };

  const handleCustomChange = (event) => {
    setCustomValue(event.target.value);
    onChange(event.target.value);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {presets.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => handlePresetChange(item.id)}
            className={`rounded-lg px-3 py-1 text-xs font-semibold border ${
              preset === item.id
                ? 'border-yellow-300 bg-yellow-200/20 text-yellow-100'
                : 'border-slate-600 text-slate-300 hover:border-yellow-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {preset !== 'custom' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Time</label>
            <input
              type="time"
              value={time}
              onChange={(event) => handleTimeChange(event.target.value)}
              className="w-full rounded-lg border border-slate-500 bg-slate-950/40 px-3 py-2 text-sm text-white"
            />
          </div>

          {preset === 'weekly' && (
            <div>
              <label className="block text-xs text-slate-400 mb-1">Day of week</label>
              <select
                value={weekday}
                onChange={(event) => handleWeekdayChange(event.target.value)}
                className="w-full rounded-lg border border-slate-500 bg-slate-950/40 px-3 py-2 text-sm text-white"
              >
                {weekDays.map((day) => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {preset === 'monthly' && (
            <div>
              <label className="block text-xs text-slate-400 mb-1">Day of month</label>
              <input
                type="number"
                min="1"
                max="31"
                value={monthday}
                onChange={(event) => handleMonthdayChange(event.target.value)}
                className="w-full rounded-lg border border-slate-500 bg-slate-950/40 px-3 py-2 text-sm text-white"
              />
            </div>
          )}
        </div>
      )}

      {preset === 'custom' && (
        <div>
          <label className="block text-xs text-slate-400 mb-1">Cron expression</label>
          <input
            type="text"
            value={customValue}
            onChange={handleCustomChange}
            className="w-full rounded-lg border border-slate-500 bg-slate-950/40 px-3 py-2 text-sm text-white"
          />
        </div>
      )}

      {hint && <p className="text-xs text-slate-500">{hint}</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

function buildCron({ preset, time, weekday, monthday, customValue }) {
  if (preset === 'custom') {
    return customValue || '0 20 * * *';
  }

  const [hours, minutes] = parseTime(time);

  if (preset === 'daily') {
    return `${minutes} ${hours} * * *`;
  }

  if (preset === 'weekly') {
    return `${minutes} ${hours} * * ${weekday}`;
  }

  if (preset === 'monthly') {
    return `${minutes} ${hours} ${monthday} * *`;
  }

  return customValue || '0 20 * * *';
}

function parseTime(time) {
  if (!time || !time.includes(':')) {
    return ['20', '0'];
  }

  const [hh, mm] = time.split(':');
  return [Number(hh) || 0, Number(mm) || 0];
}

function padTime(hours, minutes) {
  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  return `${hh}:${mm}`;
}
