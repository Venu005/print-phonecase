"use server";

import { db } from "@/db";
import {
  CaseColor,
  CaseFinish,
  CaseMaterial,
  PhoneModel,
} from "@prisma/client";

// rpc remote procedure call
export type SaveConfigProps = {
  color: CaseColor;
  finish: CaseFinish;
  material: CaseMaterial;
  model: PhoneModel;
  configId: string;
}
export async function saveConfig({
  color,
  finish,
  material,
  model,
  configId,
}: SaveConfigProps ) {
  await db.configuration.update({
    where: {
      id: configId,
    },
    data: { color, finish, material, model },
  });
}
