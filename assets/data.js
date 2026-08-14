// ===== Clover// disc exchange — catalog data =====
// Each game has a genre array (a "Set membership" per game) used throughout
// the site for Set Theory operations (Union / Intersection / Difference).

// Muted, minimal palette — matches the --action/--rpg/... vars in style.css
const GENRE_COLORS = {
  "Action":    "#C23B6B",
  "RPG":       "#12857E",
  "Racing":    "#B5730F",
  "Horror":    "#6B4FC4",
  "Sports":    "#2C8F52",
  "Adventure": "#2E63C9",
  "Indie":     "#f78b27",
};

// `cover` = path to an image file (put files in assets/images/ and reference
// them like "assets/images/neon-requiem.jpg"). Leave it as "" to keep the
// plain text-on-rings placeholder — the card looks fine either way.
const CATALOG = [
  { id: "g01", title: "Neon Requiem",     genres: ["Action", "RPG"],           price: 1590, condition: "new",  stock: 6,  cover: "assets/images/Neon-Requiem.jpg", blurb: "แผ่นแท้ปกสวย เกมแนวแอคชั่นไซไฟผสม RPG ตัวละครปรับสกิลได้อิสระ" },
  { id: "g02", title: "Iron Horizon",     genres: ["Racing"],                  price: 890,  condition: "new",  stock: 12, cover: "assets/images/Iron-Horizon.jpg", blurb: "เกมแข่งรถแนวอาร์เคดฝีมือคนไทย เฟรมเรต 60fps ลื่นทุกโค้ง" },
  { id: "g03", title: "Sunfall Kingdoms", genres: ["RPG", "Adventure"],        price: 1790, condition: "new",  stock: 8,  cover: "assets/images/Sunfall-Kingdoms.jpg", blurb: "มหากาพย์โลกเปิด ภาคใหม่ล่าสุด เสียงพากย์ไทยเต็มรูปแบบ" },
  { id: "g04", title: "Riptide Circuit",  genres: ["Racing", "Action"],        price: 990,  condition: "used", stock: 3,  cover: "assets/images/Riptide-Circuit.jpg", blurb: "แข่งรถ + ไล่ล่า ดัดแปลงรถได้อิสระ สภาพแผ่นเงางาม" },
  { id: "g05", title: "Hollow Static",    genres: ["Indie","Adventure"],       price: 1090, condition: "used", stock: 5, cover: "assets/images/Hollow-Static.jpg", blurb: "การกลับมาของอัศวินแห่งเงา " },
  { id: "g06", title: "Ashen Vale",       genres: ["RPG"],                     price: 1490, condition: "new",  stock: 0,  cover: "assets/images/Ashen-Vale.jpg", blurb: "RPG แฟนตาซีมืด ระบบต่อสู้เรียลไทม์ (สินค้าหมดชั่วคราว)" },
  { id: "g07", title: "Quarry 9",         genres: ["Horror", "Adventure"],     price: 1190, condition: "new",  stock: 4,  cover: "assets/images/Quarry-9.jpg", blurb: "ไขปริศนา+หนีตาย บรรยากาศอึดอัดสมจริง" },
  { id: "g08", title: "Striker League 26",genres: ["Sports"],                  price: 1090, condition: "new",  stock: 10, cover: "assets/images/Striker-League 26.jpg", blurb: "ฟุตบอลจำลองล่าสุด อัปเดตทีมและนักเตะปี 26" },
  { id: "g09", title: "Wraithbound",      genres: ["Action", "Horror"],        price: 1390, condition: "used", stock: 2,  cover: "assets/images/Wraithbound1.jpg", blurb: "แอคชั่นสยองขวัญ บอสใหญ่ดุดัน มือสองสภาพเยี่ยม" },
  { id: "g10", title: "Pale Meridian",    genres: ["Adventure"],               price: 990,  condition: "new",  stock: 7,  cover: "assets/images/Pale Meridian1.jpg", blurb: "เกมผจญภัยเงียบสงบ เดินสำรวจ ผ่อนคลาย" },
  { id: "g11", title: "Overdrive Nation", genres: ["Racing", "Sports"],        price: 1290, condition: "new",  stock: 9,  cover: "assets/images/OverdriveNation1.jpg", blurb: "รวมกีฬาความเร็วสูง หลายโหมดแข่งขันออนไลน์" },
  { id: "g12", title: "Cinder & Bone",    genres: ["RPG", "Horror"],           price: 1690, condition: "used", stock: 1,  cover: "assets/images/Cinder & Bone1.jpg", blurb: "RPG กอธิค เนื้อเรื่องหนักหน่วง หายากมือสองเหลือแผ่นเดียว" },
  { id: "g13", title: "God of War",       genres: ["RPG", "Action", "Indie"],  price: 1290, condition: "used", stock: 13, cover: "assets/images/God oF War.jpg", blurb: "ต่อสู่กับเทพเจ้า RPG+Action สุดมัน " },
];

// Full genre Set — derived once, used by nav pills / filter checkboxes.
const ALL_GENRES = [...new Set(CATALOG.flatMap(g => g.genres))];
