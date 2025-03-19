"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, LogOut, MapPin, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PrayerTimes, Coordinates } from 'adhan';
import moment from 'moment-timezone';

interface PrayerTime {
  name: string;
  time: Date;
  startTime: Date;
  notificationEnabled: boolean;
}

export default function Dashboard() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [timezone, setTimezone] = useState<string>('');
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Get timezone using Intl API
    if (location) {
      try {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setTimezone(timeZone);
      } catch (error) {
        console.error("Error getting timezone:", error);
        toast({
          title: "Timezone Error",
          description: "Unable to determine your timezone.",
          variant: "destructive",
        });
      }
    }
  }, [location]);

  useEffect(() => {
    // Request notification permission
    if ("Notification" in window) {
      Notification.requestPermission();
    }

    // Get user's location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Location Error",
            description: "Unable to get your location. Please enable location services.",
            variant: "destructive",
          });
        }
      );
    }
  }, []);

  useEffect(() => {
    if (location && timezone) {
      const coordinates = new Coordinates(location.lat, location.lng);
      const prayerTimes = new PrayerTimes(coordinates, new Date(), 'MWL');
      
      const prayers: PrayerTime[] = [
        { name: "Fajr", time: new Date(), startTime: prayerTimes.fajr, notificationEnabled: true },
        { name: "Dhuhr", time: new Date(), startTime: prayerTimes.dhuhr, notificationEnabled: true },
        { name: "Asr", time: new Date(), startTime: prayerTimes.asr, notificationEnabled: true },
        { name: "Maghrib", time: new Date(), startTime: prayerTimes.maghrib, notificationEnabled: true },
        { name: "Isha", time: new Date(), startTime: prayerTimes.isha, notificationEnabled: true },
      ];

      setPrayerTimes(prayers);
    }
  }, [location, timezone]);

  const formatTime = (time: Date) => {
    return moment(time).format('hh:mm A');
  };

  const getTimeRemaining = (startTime: Date) => {
    const now = moment();
    const start = moment(startTime);
    const duration = moment.duration(start.diff(now));
    
    if (duration.asMinutes() < 0) {
      return 'Started';
    }
    
    const hours = Math.floor(duration.asHours());
    const minutes = Math.floor(duration.asMinutes()) % 60;
    
    return `${hours}h ${minutes}m remaining`;
  };

  const toggleNotification = (index: number) => {
    setPrayerTimes((prev) =>
      prev.map((prayer, i) =>
        i === index
          ? { ...prayer, notificationEnabled: !prayer.notificationEnabled }
          : prayer
      )
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Prayer Dashboard</h1>
          <div className="flex items-center gap-4">
            {timezone && (
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{timezone}</span>
              </div>
            )}
            <Button variant="ghost" size="icon">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              {location ? (
                <p>
                  Latitude: {location.lat.toFixed(4)}, Longitude:{" "}
                  {location.lng.toFixed(4)}
                </p>
              ) : (
                <p>Fetching location...</p>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {prayerTimes.map((prayer, index) => (
              <Card key={prayer.name} className="relative overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{prayer.name}</span>
                    <Button
                      variant={prayer.notificationEnabled ? "default" : "outline"}
                      size="icon"
                      onClick={() => toggleNotification(index)}
                    >
                      <Bell className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-2xl font-semibold">
                      {formatTime(prayer.startTime)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {getTimeRemaining(prayer.startTime)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}