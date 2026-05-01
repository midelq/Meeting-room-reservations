import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CalendarDays } from 'lucide-react';

interface DateTimePickerProps {
  label: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  error?: string;
  minDate?: Date;
}

export function DateTimePicker({ label, value, onChange, error, minDate }: DateTimePickerProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label
        style={{
          fontSize: '12px',
          fontWeight: 500,
          color: 'var(--color-text-muted)',
          fontFamily: 'var(--font-body)',
        }}
      >
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--color-text-muted)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          <CalendarDays size={14} />
        </div>
        <ReactDatePicker
          selected={value}
          onChange={onChange}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="MMM d, yyyy HH:mm"
          minDate={minDate}
          placeholderText="Select date & time"
          className="dt-picker-input"
          calendarClassName="dt-picker-calendar"
          popperPlacement="bottom-start"
          popperProps={{ strategy: 'fixed' }}
        />
      </div>
      {error && (
        <p style={{ fontSize: '12px', color: 'var(--color-danger)', fontFamily: 'var(--font-body)' }}>
          {error}
        </p>
      )}
    </div>
  );
}
