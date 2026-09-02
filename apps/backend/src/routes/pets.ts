import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { authMiddleware } from "../middleware/auth.js";
import {
  createPetSchema,
  updatePetSchema,
} from "../schemas/pet.schema.js";
import { upload } from "../middleware/upload.js";
const router = Router();



router.post("/", authMiddleware, async (req, res) => {
  const parsed = createPetSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: parsed.error.flatten(),
    });
  }

  const pet = await prisma.pet.create({
    data: {
      ...parsed.data,
      ownerId: req.user!.id,
      birthDate: parsed.data.birthDate
        ? new Date(parsed.data.birthDate)
        : undefined,
    },
  });

  return res.status(201).json(pet);
});

router.get("/", authMiddleware, async (req, res) => {
  const pets = await prisma.pet.findMany({
    where: {
      ownerId: req.user!.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    omit:{
      photo:true,
    }
  });

  return res.json(pets);
});

router.get("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  if (typeof id !== "string") {
    return res.status(400).json({
      error: "Invalid pet id",
    });
  }

  const pet = await prisma.pet.findFirst({
    where: {
      id,
      ownerId: req.user!.id,
    },
  });

  if (!pet) {
    return res.status(404).json({
      error: "Pet not found",
    });
  }

  return res.json(pet);
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  if (typeof id !== "string") {
    return res.status(400).json({
      error: "Invalid pet id",
    });
  }

  const pet = await prisma.pet.findFirst({
    where: {
      id,
      ownerId: req.user!.id,
    },
  });

  if (!pet) {
    return res.status(404).json({
      error: "Pet not found",
    });
  }

  await prisma.pet.delete({
    where: {
      id: pet.id,
    },
  });

  return res.status(204).send();
});

router.patch("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  if (typeof id !== "string") {
    return res.status(400).json({
      error: "Invalid pet id",
    });
  }

  const parsed = updatePetSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: parsed.error.flatten(),
    });
  }

  const existingPet = await prisma.pet.findFirst({
    where: {
      id,
      ownerId: req.user!.id,
    },
  });

  if (!existingPet) {
    return res.status(404).json({
      error: "Pet not found",
    });
  }

  const pet = await prisma.pet.update({
    where: {
      id,
    },
    data: {
      ...parsed.data,
      birthDate: parsed.data.birthDate
        ? new Date(parsed.data.birthDate)
        : undefined,
    },
    select: {
      id: true,
      ownerId: true,
      name: true,
      species: true,
      breed: true,
      sex: true,
      birthDate: true,
      weight: true,
      photoType: true,
      description: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return res.json({
    ...pet,
    photoUrl: pet.photoType
      ? `/api/pets/${pet.id}/photo`
      : null,
  });
}); 
router.post(
  "/:id/photo",
  authMiddleware,
  upload.single("photo"),
  async (req, res) => {
    console.log("PHOTO UPLOAD");
console.log("file:", req.file);
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        error: "Invalid pet id",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        error: "Photo is required",
      });
    }

    const pet = await prisma.pet.findFirst({
      where: {
        id,
        ownerId: req.user!.id,
      },
    });

    if (!pet) {
      return res.status(404).json({
        error: "Pet not found",
      });
    }

    await prisma.pet.update({
  where: {
    id,
  },
  data: {
    photo: new Uint8Array(req.file.buffer),
    photoType: req.file.mimetype,
  },
});

    return res.status(204).send();
  },
);


router.get("/:id/photo", authMiddleware, async (req, res) => {
  const { id } = req.params;

  if (typeof id !== "string") {
    return res.status(400).json({
      error: "Invalid pet id",
    });
  }

  const pet = await prisma.pet.findFirst({
    where: {
      id,
      ownerId: req.user!.id,
    },
    select: {
      photo: true,
      photoType: true,
    },
  });

  if (!pet || !pet.photo || !pet.photoType) {
    return res.status(404).json({
      error: "Photo not found",
    });
  }

  res.setHeader("Content-Type", pet.photoType);

  return res.send(Buffer.from(pet.photo));
});
export default router;