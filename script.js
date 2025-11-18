// Duomenų objektas
const userData = {
  lytis: "",
  vardas: "",
  antrasVardas: "",
  pavarde: "",
  gimimoData: "",
  asmensKodas: "",
  isilavinimas: {
    tipas: "",
    istaiga: "",
    metai: "",
    kvalifikacija: "",
    laipsnis: ""
  },
  telefonas: "",
  email: "",
  adresas: "",
  vedybinePadetis: "",
  sutuoktinis: {
    vardas: "",
    pavarde: ""
  },
  profesinePadetis: "",
  profesineDetale: {},
  darboPatirtis: "",
  darboSritis: ""
};

// DOM elementai
const form = document.getElementById('anketaForm');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');

// Asmens kodo generavimas
function generuotiAsmensKoda(gimimoData, lytis) {
    if (!gimimoData || !lytis) return '';
    
    const data = new Date(gimimoData);
    const metai = data.getFullYear();
    const menuo = String(data.getMonth() + 1).padStart(2, '0');
    const diena = String(data.getDate()).padStart(2, '0');
    
    // Pirmas skaitmuo pagal amžių ir lytį
    let pirmasSkaitmuo;
    if (metai >= 1800 && metai <= 1899) {
        pirmasSkaitmuo = lytis === 'vyras' ? '1' : '2';
    } else if (metai >= 1900 && metai <= 1999) {
        pirmasSkaitmuo = lytis === 'vyras' ? '3' : '4';
    } else if (metai >= 2000 && metai <= 2099) {
        pirmasSkaitmuo = lytis === 'vyras' ? '5' : '6';
    }
    
    // Metų paskutiniai 2 skaitmenys
    const metuPabaiga = String(metai).slice(-2);
    
    // Atsitiktiniai 3 skaitmenys
    const atsitiktiniai = String(Math.floor(Math.random() * 900) + 100);
    
    // Formuojame kodą be kontrolinio skaitmens
    const dalinisKodas = pirmasSkaitmuo + metuPabaiga + menuo + diena + atsitiktiniai;
    
    // Skaičiuojame kontrolinį skaitmenį
    const kontrolinisSkaitmuo = skaiciuotiKontroliniSkaitmeni(dalinisKodas);
    
    return dalinisKodas + kontrolinisSkaitmuo;
}

function skaiciuotiKontroliniSkaitmeni(kodas) {
    const svoriai1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1];
    const svoriai2 = [3, 4, 5, 6, 7, 8, 9, 1, 2, 3];
    
    let suma = 0;
    for (let i = 0; i < 10; i++) {
        suma += parseInt(kodas[i]) * svoriai1[i];
    }
    
    let liekana = suma % 11;
    
    if (liekana < 10) {
        return liekana;
    }
    
    suma = 0;
    for (let i = 0; i < 10; i++) {
        suma += parseInt(kodas[i]) * svoriai2[i];
    }
    
    liekana = suma % 11;
    return liekana < 10 ? liekana : 0;
}

// Amžiaus skaičiavimas
function skaiciuotiAmziu(gimimoData) {
    if (!gimimoData) return 0;
    const siandien = new Date();
    const gimimo = new Date(gimimoData);
    let amzius = siandien.getFullYear() - gimimo.getFullYear();
    const menesiai = siandien.getMonth() - gimimo.getMonth();
    if (menesiai < 0 || (menesiai === 0 && siandien.getDate() < gimimo.getDate())) {
        amzius--;
    }
    return amzius;
}

// Progreso atnaujinimas
function atnaujintiProgresa() {
    const visiLaukai = form.querySelectorAll('input:not([readonly]), select, textarea');
    const matomiLaukai = Array.from(visiLaukai).filter(laukas => {
        const parent = laukas.closest('.form-group, #issilavinimoDetales, #sutuoktinioDetales, #studijuDetales, #dirbaDetales, #nedirbaDetales, #atostoguDetales');
        return parent && parent.offsetParent !== null;
    });
    
    let uzpildyta = 0;
    matomiLaukai.forEach(laukas => {
        if (laukas.value.trim() !== '') {
            uzpildyta++;
        }
    });
    
    const procentai = matomiLaukai.length > 0 ? Math.round((uzpildyta / matomiLaukai.length) * 100) : 0;
    progressFill.style.width = procentai + '%';
    progressText.textContent = `Užpildyta: ${procentai}%`;
}

// Lytis ir gimimo data - asmens kodo generavimas
document.getElementById('lytis').addEventListener('change', function() {
    userData.lytis = this.value;
    const gimimoData = document.getElementById('gimimoData').value;
    if (gimimoData) {
        const asmensKodas = generuotiAsmensKoda(gimimoData, this.value);
        document.getElementById('asmensKodas').value = asmensKodas;
        userData.asmensKodas = asmensKodas;
    }
    atnaujintiProgresa();
});

document.getElementById('gimimoData').addEventListener('change', function() {
    userData.gimimoData = this.value;
    const lytis = document.getElementById('lytis').value;
    if (lytis) {
        const asmensKodas = generuotiAsmensKoda(this.value, lytis);
        document.getElementById('asmensKodas').value = asmensKodas;
        userData.asmensKodas = asmensKodas;
    }
    
    // Vedybinės padėties logika pagal amžių
    const amzius = skaiciuotiAmziu(this.value);
    const vedybinesPadetisSelect = document.getElementById('vedybinePadetis');
    
    if (amzius < 16) {
        vedybinesPadetisSelect.value = 'nevedesTekejusi';
        vedybinesPadetisSelect.disabled = true;
        document.getElementById('sutuoktinioDetales').style.display = 'none';
    } else {
        vedybinesPadetisSelect.disabled = false;
    }
    
    atnaujintiProgresa();
});

// Pagrindiai laukai
document.getElementById('vardas').addEventListener('input', function() {
    userData.vardas = this.value;
    atnaujintiProgresa();
});

document.getElementById('antrasVardas').addEventListener('input', function() {
    userData.antrasVardas = this.value;
    atnaujintiProgresa();
});

document.getElementById('pavarde').addEventListener('input', function() {
    userData.pavarde = this.value;
    atnaujintiProgresa();
});

// Išsilavinimas
document.getElementById('isilavinimas').addEventListener('change', function() {
    userData.isilavinimas.tipas = this.value;
    const detales = document.getElementById('issilavinimoDetales');
    const kvalifikacijaGroup = document.getElementById('kvalifikacijaGroup');
    const laipsnisGroup = document.getElementById('laipsnisGroup');
    
    if (this.value === '' || this.value === 'pagrindinis' || this.value === 'vidurinis') {
        detales.style.display = 'none';
        // Išvalome nereikalingus laukus
        document.getElementById('istaiga').value = '';
        document.getElementById('baigimoMetai').value = '';
        document.getElementById('kvalifikacija').value = '';
        document.getElementById('laipsnis').value = '';
    } else {
        detales.style.display = 'block';
        
        if (this.value === 'profesinis') {
            kvalifikacijaGroup.style.display = 'block';
            laipsnisGroup.style.display = 'none';
            document.getElementById('laipsnis').value = '';
        } else if (this.value === 'aukstasis-kolegijinis' || this.value === 'aukstasis-universitetinis') {
            kvalifikacijaGroup.style.display = 'block';
            laipsnisGroup.style.display = 'block';
            
            // Nustatome galimus laipsnius
            const laipsnisSelect = document.getElementById('laipsnis');
            laipsnisSelect.innerHTML = '<option value="">Pasirinkite...</option>';
            
            if (this.value === 'aukstasis-kolegijinis') {
                laipsnisSelect.innerHTML += '<option value="profesinis-bakalauras">Profesinis bakalauras</option>';
            } else {
                laipsnisSelect.innerHTML += '<option value="bakalauras">Bakalauras</option>';
                laipsnisSelect.innerHTML += '<option value="magistras">Magistras</option>';
                laipsnisSelect.innerHTML += '<option value="daktaras">Mokslų daktaras</option>';
            }
        }
    }
    atnaujintiProgresa();
});

document.getElementById('istaiga').addEventListener('input', function() {
    userData.isilavinimas.istaiga = this.value;
    atnaujintiProgresa();
});

document.getElementById('baigimoMetai').addEventListener('input', function() {
    userData.isilavinimas.metai = this.value;
    atnaujintiProgresa();
});

document.getElementById('kvalifikacija').addEventListener('input', function() {
    userData.isilavinimas.kvalifikacija = this.value;
    atnaujintiProgresa();
});

document.getElementById('laipsnis').addEventListener('change', function() {
    userData.isilavinimas.laipsnis = this.value;
    atnaujintiProgresa();
});

// Kontaktai
document.getElementById('telefonas').addEventListener('input', function() {
    // Automatiškai pridedame +370 jei pradeda rašyti 6
    if (this.value.length === 1 && this.value === '6') {
        this.value = '+370' + this.value;
    }
    userData.telefonas = this.value;
    atnaujintiProgresa();
});

document.getElementById('email').addEventListener('input', function() {
    userData.email = this.value;
    atnaujintiProgresa();
});

document.getElementById('adresas').addEventListener('input', function() {
    userData.adresas = this.value;
    atnaujintiProgresa();
});

// Vedybinė padėtis
document.getElementById('vedybinePadetis').addEventListener('change', function() {
    userData.vedybinePadetis = this.value;
    const sutuoktinioDetales = document.getElementById('sutuoktinioDetales');
    
    if (this.value === 'vedesTekejusi') {
        sutuoktinioDetales.style.display = 'block';
    } else {
        sutuoktinioDetales.style.display = 'none';
        document.getElementById('sutuoktinioVardas').value = '';
        document.getElementById('sutuoktinioPavarde').value = '';
        userData.sutuoktinis.vardas = '';
        userData.sutuoktinis.pavarde = '';
    }
    atnaujintiProgresa();
});

document.getElementById('sutuoktinioVardas').addEventListener('input', function() {
    userData.sutuoktinis.vardas = this.value;
    atnaujintiProgresa();
});

document.getElementById('sutuoktinioPavarde').addEventListener('input', function() {
    userData.sutuoktinis.pavarde = this.value;
    atnaujintiProgresa();
});

// Profesinė padėtis
document.getElementById('profesinePadetis').addEventListener('change', function() {
    userData.profesinePadetis = this.value;
    
    // Paslėpti visus papildomus laukus
    document.getElementById('studijuDetales').style.display = 'none';
    document.getElementById('dirbaDetales').style.display = 'none';
    document.getElementById('nedirbaDetales').style.display = 'none';
    document.getElementById('atostoguDetales').style.display = 'none';
    
    // Išvalyti detales
    userData.profesineDetale = {};
    
    // Rodyti atitinkamus laukus
    if (this.value === 'studijuoja') {
        document.getElementById('studijuDetales').style.display = 'block';
    } else if (this.value === 'dirba') {
        document.getElementById('dirbaDetales').style.display = 'block';
    } else if (this.value === 'nedirba') {
        document.getElementById('nedirbaDetales').style.display = 'block';
    } else if (this.value === 'tevystesAtostogose') {
        document.getElementById('atostoguDetales').style.display = 'block';
    }
    
    atnaujintiProgresa();
});

// Studijų detalės
document.getElementById('studijuPakopa')?.addEventListener('change', function() {
    userData.profesineDetale.studijuPakopa = this.value;
    atnaujintiProgresa();
});

document.getElementById('kursas')?.addEventListener('input', function() {
    userData.profesineDetale.kursas = this.value;
    atnaujintiProgresa();
});

document.getElementById('studijuIstaiga')?.addEventListener('input', function() {
    userData.profesineDetale.studijuIstaiga = this.value;
    atnaujintiProgresa();
});

document.getElementById('tiketiniBaigimoMetai')?.addEventListener('input', function() {
    userData.profesineDetale.tiketiniBaigimoMetai = this.value;
    atnaujintiProgresa();
});

// Darbo detalės
document.getElementById('darboIstaiga')?.addEventListener('input', function() {
    userData.profesineDetale.darboIstaiga = this.value;
    atnaujintiProgresa();
});

document.getElementById('pareigos')?.addEventListener('input', function() {
    userData.profesineDetale.pareigos = this.value;
    atnaujintiProgresa();
});

// Nedarbo detalės
document.getElementById('nedarboPriezastis')?.addEventListener('input', function() {
    userData.profesineDetale.nedarboPriezastis = this.value;
    atnaujintiProgresa();
});

// Atostogų detalės
document.getElementById('atostoguPabaiga')?.addEventListener('input', function() {
    userData.profesineDetale.atostoguPabaiga = this.value;
    atnaujintiProgresa();
});

// Darbo patirtis ir sritis
document.getElementById('darboPatirtis').addEventListener('input', function() {
    userData.darboPatirtis = this.value;
    atnaujintiProgresa();
});

document.getElementById('darboSritis').addEventListener('change', function() {
    userData.darboSritis = this.value;
    atnaujintiProgresa();
});

// Formos pateikimas
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Rodome rezultatą
    document.getElementById('rezultatas').style.display = 'block';
    document.getElementById('rezultatoTekstas').textContent = JSON.stringify(userData, null, 2);
    
    // Smooth scroll į rezultatą
    document.getElementById('rezultatas').scrollIntoView({ behavior: 'smooth' });
    
    console.log('Surinkti duomenys:', userData);
});

// Pradinė būsena
atnaujintiProgresa();
