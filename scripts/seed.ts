/**
 * Dev-only seed script for EP Estudio's real data (from _archive_docs).
 * Wipes the target database and recreates it from scratch — run whenever
 * you want a clean, realistic dataset to develop/demo against.
 *
 * Usage: pnpm seed
 */
import { existsSync } from "node:fs";
import { connectDB } from "../lib/db/connect";
import { hashPassword } from "../lib/auth/password";
import { Activity, Business, Enrollment, Instructor, InstructorActivity, Student, User } from "../models";

const OWNER_EMAIL = "aldocfabro@gmail.com";
const OWNER_PASSWORD = "EpEstudio2026!";

function iso(mdyy: string) {
  const [m, d, y] = mdyy.split("/").map(Number);
  return `${2000 + y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

const compePekes = [
  { firstName: "Lucía", lastName: "Callea Bustos", dni: "55.357.022", fecha: "1/12/16" },
  { firstName: "Helena", lastName: "Osorio Bergonzi", dni: "56.683.499", fecha: "11/27/17" },
  { firstName: "Ángeles", lastName: "Colaianni Bergonzi", dni: "55.656.049", fecha: "1/4/16" },
  { firstName: "Sara", lastName: "Leal", dni: "28.914.340", fecha: "10/11/18" },
  { firstName: "Mateo", lastName: "Simón Riello", dni: "57.785.332", fecha: "5/20/19" },
  { firstName: "Lara", lastName: "Valeri", dni: "57.395.755", fecha: "1/5/18" },
  { firstName: "Pilar", lastName: "Halabicky Díaz", dni: "57.608.966", fecha: "3/19/19" },
  { firstName: "Rufina", lastName: "Halabicky Díaz", dni: "58.599.760", fecha: "10/24/20" },
];

const compeReggeton = [
  { firstName: "Pilar", lastName: "Sacchi", dni: "55.309.817", fecha: "1/11/16" },
  { firstName: "Mía", lastName: "Sayal Cano", dni: "54.114.456", fecha: "7/9/14" },
  { firstName: "Julia", lastName: "Pagano Baleta", dni: "54.115.982", fecha: "7/15/19" },
  { firstName: "Josefina", lastName: "De la Iglesia", dni: "55.216.764", fecha: "12/19/15" },
  { firstName: "Martina", lastName: "Bonetto", dni: "54.072.725", fecha: "11/17/14" },
  { firstName: "Delfina", lastName: "Fortuna", dni: "54.199.361", fecha: "7/24/14" },
  { firstName: "Alma", lastName: "Pereyra", dni: "54.843.021", fecha: "5/11/15" },
  { firstName: "Martina", lastName: "Cozzi", dni: "54.502.781", fecha: "2/9/15" },
  { firstName: "Malena", lastName: "Altamirano", dni: "52.636.923", fecha: "7/29/18" },
  { firstName: "Paloma", lastName: "Molina", dni: "54.502.403", fecha: "12/15/14" },
  { firstName: "Constanza", lastName: "Mastroianni", dni: "54.445.027", fecha: "12/20/14" },
  { firstName: "Agostina", lastName: "Facchin", dni: "55.309.926", fecha: "2/12/16" },
  { firstName: "Francesca", lastName: "Botta", dni: "55.245.932", fecha: "11/17/15" },
  { firstName: "Indira", lastName: "Bono", dni: "57.038.158", fecha: "2/24/18" },
  { firstName: "Mirella", lastName: "Remache", dni: "54.201.305", fecha: "10/8/14" },
  { firstName: "Juana", lastName: "Bono", dni: "54.620.689", fecha: "3/25/15" },
  { firstName: "Alma", lastName: "Barrionuevo", dni: "55.407.899", fecha: "4/25/16" },
];

// Blank-DNI rows in the source spreadsheet for these two point back to the Pekes roster —
// they dance both choreographies.
const alsoInReggeton = new Set(["Ángeles Colaianni Bergonzi", "Helena Osorio Bergonzi"]);

// "Compe Brasilero" (WhatsApp roster) only lists first names. Confident matches below are
// cross-referenced against the two rosters above; genuinely ambiguous/unmatched names (two
// "Pilar"s, two "Martina"s, no match for "Sole") become minimal placeholder records instead
// of guessing wrong.
const brasileroConfidentMatches = new Set([
  "Alma Pereyra",
  "Mía Sayal Cano",
  "Helena Osorio Bergonzi",
  "Mirella Remache",
  "Lucía Callea Bustos",
]);
const brasileroPlaceholders = ["Pilar", "Martu", "Sole"];

if (existsSync(".env.local")) process.loadEnvFile(".env.local");

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Falta MONGODB_URI (revisá tu .env.local)");
  console.log(`Conectando a ${uri} ...`);
  await connectDB();

  console.log("Borrando datos existentes...");
  await Promise.all([
    Business.deleteMany({}),
    User.deleteMany({}),
    Student.deleteMany({}),
    Instructor.deleteMany({}),
    Activity.deleteMany({}),
    Enrollment.deleteMany({}),
    InstructorActivity.deleteMany({}),
  ]);

  console.log("Creando negocio y usuario...");
  const business = await Business.create({
    name: "EP Estudio de Baile",
    type: "academia",
    phone: "3417701010",
    address: "Roldán",
    onboardingCompleted: true,
  });

  await User.create({
    email: OWNER_EMAIL,
    passwordHash: await hashPassword(OWNER_PASSWORD),
    businessId: business._id,
    role: "owner",
  });

  console.log("Creando instructora...");
  const eliana = await Instructor.create({
    businessId: business._id,
    firstName: "Eliana",
    lastName: "Pellegrini",
    birthDate: new Date("1990-01-01"),
    position: "Instructora de Ritmos",
    documentType: "CUIL",
    documentNumber: "",
    sex: "femenino",
    status: "active",
    notes: "En EP Estudio de Baile desde el 30/06/2022 — completar fecha de nacimiento y CUIL reales.",
  });

  console.log("Creando disciplinas...");
  const activityByName = new Map<string, InstanceType<typeof Activity>>();
  for (const name of ["Compe Pekes", "Compe Reggeton", "Compe Brasilero"]) {
    const activity = await Activity.create({ businessId: business._id, name, status: "active" });
    activityByName.set(name, activity);
    await InstructorActivity.create({ businessId: business._id, instructorId: eliana._id, activityId: activity._id });
  }

  console.log("Creando alumnas/os...");
  const rawStudents = [
    ...compePekes.map((s) => ({
      ...s,
      activities: alsoInReggeton.has(`${s.firstName} ${s.lastName}`)
        ? ["Compe Pekes", "Compe Reggeton"]
        : ["Compe Pekes"],
    })),
    ...compeReggeton.map((s) => ({ ...s, activities: ["Compe Reggeton"] })),
  ].map((s) => {
    const fullName = `${s.firstName} ${s.lastName}`;
    const activities = brasileroConfidentMatches.has(fullName) ? [...s.activities, "Compe Brasilero"] : s.activities;
    return {
      firstName: s.firstName,
      lastName: s.lastName,
      birthDate: new Date(iso(s.fecha)),
      documentType: "DNI" as const,
      documentNumber: s.dni,
      sex: s.firstName === "Mateo" ? ("masculino" as const) : ("femenino" as const),
      responsibleContactName: "Completar dato de contacto",
      activities,
    };
  });

  for (const firstName of brasileroPlaceholders) {
    rawStudents.push({
      firstName,
      lastName: "(completar apellido)",
      birthDate: new Date("2010-01-01"),
      documentType: "DNI" as const,
      documentNumber: "",
      sex: "femenino" as const,
      responsibleContactName: "Completar dato de contacto",
      activities: ["Compe Brasilero"],
    });
  }

  for (const s of rawStudents) {
    const student = await Student.create({
      businessId: business._id,
      firstName: s.firstName,
      lastName: s.lastName,
      birthDate: s.birthDate,
      documentType: s.documentType,
      documentNumber: s.documentNumber,
      sex: s.sex,
      status: "active",
      responsibleContactName: s.responsibleContactName,
    });

    for (const activityName of s.activities) {
      const activity = activityByName.get(activityName)!;
      await Enrollment.create({
        businessId: business._id,
        studentId: student._id,
        activityId: activity._id,
        status: "active",
      });
    }
  }

  console.log(`\nListo. ${rawStudents.length} alumnas/os, 1 instructora, 3 disciplinas.`);
  console.log(`Login: ${OWNER_EMAIL} / ${OWNER_PASSWORD}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed falló:", err);
  process.exit(1);
});
