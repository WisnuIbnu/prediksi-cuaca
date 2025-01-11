
'use strict';
export const weekDayNames = [
    'Minggu',
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
    'Sabtu'
];

export const monthNames = [ 
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember'
];


// DataUnix = unix date in second
// timezone = timezone shift from UTC in Seconds
// Format Return = "Sunday 10, Jan"

export const getDate = function(dateUnix, timezone) {
    const date = new Date((dateUnix + timezone) * 1000);
    const weekDayName = weekDayNames[date.getUTCDay()];
    const monthName = monthNames[date.getUTCMonth()]; 
    const year = date.getUTCFullYear(); 

    return `${weekDayName}, ${date.getUTCDate()} ${monthName} ${year}`;
};

// DataUnix = unix date in second
// timezone = timezone shift from UTC in Seconds
// Format Return = "HH:MM AM/PM"

export const getTime = function(timeUnix, timezone) {
    
    const date = new Date((timeUnix + timezone  * 3600) * 1000); 
    const hours = date.getHours(); 
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
}



// DataUnix = unix date in second
// timezone = timezone shift from UTC in Seconds
// Format Return = "HH AM/PM"

export const getHours = function(timeUnix, timezone) {
    const date = new Date((timeUnix + timezone) * 1000);
    const hours = date.getHours(); 
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
}


// mps : metter per seconds
// Format : Kilometer per hours

export const mps_to_kmh = mps => {
    const mph = mps * 3600;
    return mph / 1000;
}

export const aqiText = {
    1: {
        level: "Baik",
        message: "Kualitas udara dianggap memadai, dan polusi udara menimbulkan sedikit atau tidak ada risiko."
    },
    2: {
        level: "Sedang",
        message: "Kualitas udara dapat diterima; namun, untuk beberapa polutan, mungkin ada masalah kesehatan moderat bagi sebagian kecil orang yang sangat sensitif terhadap polusi udara."
    },
    3: {
        level: "Moderate",
        message: "Anggota kelompok sensitif mungkin mengalami efek kesehatan. Masyarakat umum tidak cenderung terpengaruh."
    },
    4: {
        level: "Buruk",
        message: "Semua orang mungkin mulai mengalami efek kesehatan; anggota kelompok sensitif mungkin mengalami efek kesehatan yang lebih serius."
    },
    5: {
        level: "Sangat Buruk",
        message: "Peringatan kesehatan kondisi darurat, seluruh populasi lebih mungkin terpengaruh."
    },
}

