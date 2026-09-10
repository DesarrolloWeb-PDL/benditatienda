'use client';

import * as React from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/components/language-provider';

interface TimeGatingBannerProps {
  isOpen: boolean;
  timeRemaining?: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  nextOpening?: string;
  openingDayLabel?: string;
  openingHour?: number;
  openingMinute?: number;
  closingDayLabel?: string;
  closingHour?: number;
  closingMinute?: number;
}

export function TimeGatingBanner({
  isOpen,
  timeRemaining,
  nextOpening,
  openingDayLabel,
  openingHour,
  openingMinute,
  closingDayLabel,
  closingHour,
  closingMinute,
}: TimeGatingBannerProps) {
  const { t } = useLanguage();

  const dayMap: Record<string, string> = {
    'Domingo': t.daySunday,
    'Lunes': t.dayMonday,
    'Martes': t.dayTuesday,
    'Miércoles': t.dayWednesday,
    'Jueves': t.dayThursday,
    'Viernes': t.dayFriday,
    'Sábado': t.daySaturday,
  };

  const translatedOpeningDay = openingDayLabel ? (dayMap[openingDayLabel] ?? openingDayLabel) : '';
  const translatedClosingDay = closingDayLabel ? (dayMap[closingDayLabel] ?? closingDayLabel) : '';

  if (isOpen) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-green-900">
              {t.timeOpen}
            </h3>
            <p className="text-sm text-green-700">
              {t.timeOpenBetween} {translatedOpeningDay} {String(openingHour).padStart(2, '0')}:{String(openingMinute).padStart(2, '0')} y {translatedClosingDay} {String(closingHour).padStart(2, '0')}:{String(closingMinute).padStart(2, '0')}
            </p>
          </div>
          <Badge variant="success" className="shrink-0">
            {t.timeBadgeOpen}
          </Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-red-900/80 border-red-700">
      <CardContent className="flex items-center gap-3 p-4">
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-red-800/60 flex items-center justify-center">
            <AlertCircle className="h-5 w-5 text-red-300" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-red-100">
            {t.timeClosed}
          </h3>
          {timeRemaining && (
            <p className="text-sm text-red-200">
              {t.timeOpensIn} {timeRemaining.days}d {timeRemaining.hours}h{' '}
              {timeRemaining.minutes}m
            </p>
          )}
          <p className="text-xs text-red-300 mt-2">
            {t.timeSchedule} {translatedOpeningDay} {String(openingHour).padStart(2, '0')}:{String(openingMinute).padStart(2, '0')} a {translatedClosingDay} {String(closingHour).padStart(2, '0')}:{String(closingMinute).padStart(2, '0')}
          </p>
        </div>
        <Badge variant="destructive" className="shrink-0">
          {t.timeBadgeClosed}
        </Badge>
      </CardContent>
    </Card>
  );
}
