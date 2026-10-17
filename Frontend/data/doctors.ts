
export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  initials: string;
  color: string;
  education: string;
  about: string;
  languages: string[];
  hospital: string;
  workingHours: {
    day: string;
    hours: string;
  }[];
};

export const doctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Ahmet Yılmaz",
    specialty: "Kardiyoloji",
    experience: 12,
    rating: 4.9,
    initials: "AY",
    color: "bg-blue-100 text-blue-700",
    education: "İstanbul Üniversitesi Tıp Fakültesi",
    about:
      "Kalp ve damar hastalıklarının tanı ve tedavisi alanında deneyimli bir hekimdir. Hasta odaklı yaklaşımıyla kişiye özel tedavi planları oluşturur.",
    languages: ["Türkçe", "İngilizce"],
    hospital: "MediCare Hastanesi",
    workingHours: [
      { day: "Pazartesi", hours: "09:00 - 17:00" },
      { day: "Salı", hours: "09:00 - 17:00" },
      { day: "Çarşamba", hours: "09:00 - 13:00" },
      { day: "Perşembe", hours: "09:00 - 17:00" },
      { day: "Cuma", hours: "09:00 - 15:00" },
    ],
  },
  {
    id: "2",
    name: "Dr. Zeynep Demir",
    specialty: "İç Hastalıkları",
    experience: 9,
    rating: 4.8,
    initials: "ZD",
    color: "bg-purple-100 text-purple-700",
    education: "Hacettepe Üniversitesi Tıp Fakültesi",
    about:
      "Genel sağlık değerlendirmesi, kronik hastalıkların takibi ve koruyucu sağlık hizmetleri alanlarında çalışmaktadır.",
    languages: ["Türkçe", "İngilizce"],
    hospital: "MediCare Hastanesi",
    workingHours: [
      { day: "Pazartesi", hours: "09:00 - 16:00" },
      { day: "Salı", hours: "09:00 - 17:00" },
      { day: "Çarşamba", hours: "09:00 - 17:00" },
      { day: "Perşembe", hours: "10:00 - 16:00" },
      { day: "Cuma", hours: "09:00 - 15:00" },
    ],
  },
  {
    id: "3",
    name: "Dr. Mehmet Kaya",
    specialty: "Nöroloji",
    experience: 15,
    rating: 4.9,
    initials: "MK",
    color: "bg-green-100 text-green-700",
    education: "Ankara Üniversitesi Tıp Fakültesi",
    about:
      "Sinir sistemi hastalıklarının değerlendirilmesi ve nörolojik rahatsızlıkların takibi üzerine çalışmaktadır.",
    languages: ["Türkçe"],
    hospital: "MediCare Hastanesi",
    workingHours: [
      { day: "Pazartesi", hours: "09:00 - 17:00" },
      { day: "Salı", hours: "09:00 - 17:00" },
      { day: "Çarşamba", hours: "09:00 - 13:00" },
      { day: "Perşembe", hours: "09:00 - 17:00" },
      { day: "Cuma", hours: "09:00 - 15:00" },
    ],
  },
  {
    id: "4",
    name: "Dr. Elif Şahin",
    specialty: "Dermatoloji",
    experience: 8,
    rating: 4.7,
    initials: "EŞ",
    color: "bg-pink-100 text-pink-700",
    education: "Ege Üniversitesi Tıp Fakültesi",
    about:
      "Cilt, saç ve tırnak sağlığı ile ilgili hastalıkların değerlendirilmesi ve tedavisi alanında çalışmaktadır.",
    languages: ["Türkçe", "İngilizce"],
    hospital: "MediCare Hastanesi",
    workingHours: [
      { day: "Pazartesi", hours: "09:00 - 17:00" },
      { day: "Salı", hours: "09:00 - 15:00" },
      { day: "Çarşamba", hours: "09:00 - 17:00" },
      { day: "Perşembe", hours: "09:00 - 17:00" },
      { day: "Cuma", hours: "09:00 - 13:00" },
    ],
  },
  {
    id: "5",
    name: "Dr. Mustafa Çelik",
    specialty: "Ortopedi",
    experience: 11,
    rating: 4.8,
    initials: "MÇ",
    color: "bg-orange-100 text-orange-700",
    education: "Marmara Üniversitesi Tıp Fakültesi",
    about:
      "Kas ve iskelet sistemi hastalıkları, eklem sorunları ve hareket sistemi rahatsızlıklarının değerlendirilmesi üzerine çalışmaktadır.",
    languages: ["Türkçe"],
    hospital: "MediCare Hastanesi",
    workingHours: [
      { day: "Pazartesi", hours: "09:00 - 17:00" },
      { day: "Salı", hours: "09:00 - 17:00" },
      { day: "Çarşamba", hours: "10:00 - 16:00" },
      { day: "Perşembe", hours: "09:00 - 17:00" },
      { day: "Cuma", hours: "09:00 - 15:00" },
    ],
  },
  {
    id: "6",
    name: "Dr. Ayşe Arslan",
    specialty: "Göz Hastalıkları",
    experience: 10,
    rating: 4.9,
    initials: "AA",
    color: "bg-cyan-100 text-cyan-700",
    education: "Dokuz Eylül Üniversitesi Tıp Fakültesi",
    about:
      "Göz sağlığının korunması, görme sorunlarının değerlendirilmesi ve göz hastalıklarının takibi alanlarında hizmet vermektedir.",
    languages: ["Türkçe", "İngilizce"],
    hospital: "MediCare Hastanesi",
    workingHours: [
      { day: "Pazartesi", hours: "09:00 - 17:00" },
      { day: "Salı", hours: "09:00 - 17:00" },
      { day: "Çarşamba", hours: "09:00 - 17:00" },
      { day: "Perşembe", hours: "09:00 - 13:00" },
      { day: "Cuma", hours: "09:00 - 15:00" },
    ],
  },
];
