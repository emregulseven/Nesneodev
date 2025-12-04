const readline = require('readline');

class KuantumCokusuException extends Error {
    constructor(id) {
        super(`Kuantum çöküşü! Patlayan nesne ID: ${id}`);
        this.name = "KuantumCokusuException";
    }
}

class IKritik {
    AcilDurumSogutmasi() {
        throw new Error("Implement edilmedi");
    }
}

class KuantumNesnesi {
    constructor(id, stabilite, tehlike) {
        this.ID = id;
        this._stabilite = null;
        this.stabilite = stabilite;
        this.tehlikeSeviyesi = Math.min(10, Math.max(1, tehlike));
    }

    get stabilite() { return this._stabilite; }
    set stabilite(val) {
        if (val > 100) this._stabilite = 100;
        else if (val < 0) this._stabilite = 0;
        else this._stabilite = val;
        if (this._stabilite <= 0) throw new KuantumCokusuException(this.ID);
    }

    AnalizEt() { throw new Error("Implement"); }

    DurumBilgisi() {
        return `ID: ${this.ID} | Stabilite: ${this.stabilite.toFixed(2)} | Tehlike: ${this.tehlikeSeviyesi}`;
    }
}

class VeriPaketi extends KuantumNesnesi {
    constructor(id, s) { super(id, s, 1); }
    AnalizEt() {
        console.log("Veri içeriği okundu.");
        this.stabilite = this.stabilite - 5;
    }
}

class KaranlikMadde extends KuantumNesnesi {
    constructor(id, s, t) { super(id, s, t); }
    AnalizEt() {
        console.log("Karanlık madde analiz ediliyor...");
        this.stabilite = this.stabilite - 15;
    }
    AcilDurumSogutmasi() {
        this.stabilite = this.stabilite + 50;
        console.log("Acil soğutma uygulandı.");
    }
}

class AntiMadde extends KuantumNesnesi {
    constructor(id, s, t) { super(id, s, t); }
    AnalizEt() {
        console.log("Evrenin dokusu titriyor...");
        this.stabilite = this.stabilite - 25;
    }
    AcilDurumSogutmasi() {
        this.stabilite = this.stabilite + 50;
        console.log("Acil soğutma uygulandı.");
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(q) {
    return new Promise(resolve => rl.question(q, ans => resolve(ans)));
}

const envanter = [];
const { randomBytes } = require('crypto');

function yeniNesneUret() {
    const tip = Math.floor(Math.random()*3) + 1;
    const id = randomBytes(4).toString('hex');
    const s = Math.floor(Math.random()*71) + 30;
    if (tip === 1) {
        envanter.push(new VeriPaketi(id, s));
        console.log(`VeriPaketi eklendi. ID: ${id}`);
    } else if (tip === 2) {
        envanter.push(new KaranlikMadde(id, s, Math.floor(Math.random()*5)+3));
        console.log(`KaranlıkMadde eklendi. ID: ${id}`);
    } else {
        envanter.push(new AntiMadde(id, s, Math.floor(Math.random()*3)+7));
        console.log(`AntiMadde eklendi. ID: ${id}`);
    }
}

function listele() {
    if (envanter.length === 0) { console.log("Envanter boş."); return; }
    envanter.forEach(n => console.log(n.DurumBilgisi()));
}

function bul(id) {
    return envanter.find(n => n.ID === id);
}

async function analizIste() {
    const id = (await question("Analiz edilecek nesnenin ID'si: ")).trim();
    const n = bul(id);
    if (!n) { console.log("ID bulunamadı."); return; }
    n.AnalizEt();
    console.log("Analiz sonrası: " + n.DurumBilgisi());
}

async function sogutmaIste() {
    const id = (await question("Soğutulacak nesnenin ID'si: ")).trim();
    const n = bul(id);
    if (!n) { console.log("ID bulunamadı."); return; }
    if (typeof n.AcilDurumSogutmasi === "function") {
        n.AcilDurumSogutmasi();
        console.log("Soğutma sonrası: " + n.DurumBilgisi());
    } else {
        console.log("Bu nesne soğutulamaz!");
    }
}

(async function main(){
    try {
        while (true) {
            console.log("\nKUANTUM AMBARI KONTROL PANELİ");
            console.log("1. Yeni Nesne Ekle");
            console.log("2. Tüm Envanteri Listele");
            console.log("3. Nesneyi Analiz Et (ID ile)");
            console.log("4. Acil Durum Soğutması Yap (ID ile)");
            console.log("5. Çıkış");
            const sec = (await question("Seçiminiz: ")).trim();
            if (sec === "1") yeniNesneUret();
            else if (sec === "2") listele();
            else if (sec === "3") await analizIste();
            else if (sec === "4") await sogutmaIste();
            else if (sec === "5") { rl.close(); return; }
            else console.log("Geçersiz seçim.");
        }
    } catch (ex) {
        if (ex.name === "KuantumCokusuException") {
            console.log("\n\nSİSTEM ÇÖKTÜ! TAHLİYE BAŞLATILIYOR...");
            console.log(ex.message);
            rl.close();
        } else {
            console.error("Beklenmeyen hata:", ex);
            rl.close();
        }
    }
})();
