import { HTTP } from "./http";
import type { CResponse } from "./interfaces/Response.interface";

export interface ChurchInfo {
  id?: string;
  name?: string | null;
  description?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  foundedYear?: number | null;
  facebookUrl?: string | null;
  youtubeUrl?: string | null;
  instagramUrl?: string | null;
  
  aboutUsTitle?: string | null;
  aboutUsSubTitle?: string | null;
  aboutUsImage?: string | null;
  aboutUs?: string | null;

  aboutHeroImage?: string | null;
  giveHeroImage?: string | null;
  eventHeroImage?: string | null;
  galleryHeroImage?: string | null;
  ministryHeroImage?: string | null;
  sermonsHeroImage?: string | null;
  
  pastorName?: string | null;
  pastorTitle1?: string | null;
  pastorTitle2?: string | null;
  pastorMessage1?: string | null;
  pastorMessage2?: string | null;
  pastorAvatar?: string | null;

  video1?: string | null;
  video2?: string | null;

  bankAccountName?: string | null;
  bank?: string | null;
  accountNumber?: string | null;
  routingNumber?: string | null;

  createdAt?: string;
  updatedAt?: string;
}

export type UpdateChurchInfoInput = Partial<ChurchInfo>;

const IMAGE_FIELDS = [
  "aboutUsImage",
  "aboutHeroImage",
  "giveHeroImage",
  "eventHeroImage",
  "galleryHeroImage",
  "ministryHeroImage",
  "sermonsHeroImage",
  "pastorAvatar",
] as const;

const getImageUrl = (imageUrl?: string | null) => {
  if (!imageUrl) return imageUrl ?? null;

  if (/^https?:\/\//i.test(imageUrl) || /^data:/i.test(imageUrl)) {
    return imageUrl;
  }

  if (import.meta.server) return imageUrl;

  const baseUrl = useRuntimeConfig().public.apiBaseUrl;

  if (!baseUrl) return imageUrl;

  return `${baseUrl.replace(/\/$/, "")}${imageUrl}`;
};

const normalizeChurchInfo = (
  churchInfo?: ChurchInfo | null,
): ChurchInfo | null => {
  if (!churchInfo) return null;

  const normalized = { ...churchInfo };

  IMAGE_FIELDS.forEach((field) => {
    if (typeof normalized[field] === "string") {
      normalized[field] = getImageUrl(normalized[field] as string);
    }
  });

  return normalized;
};

const appendFormData = (
  formData: FormData,
  key: string,
  value: string | number | boolean | null | undefined,
) => {
  if (value === null || value === undefined || value === "") return;

  formData.append(key, String(value));
};

const isFileLike = (value: unknown): value is File => {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    typeof (value as { name?: unknown }).name === "string" &&
    "type" in value &&
    typeof (value as { type?: unknown }).type === "string"
  );
};

const toFormData = (
  data: UpdateChurchInfoInput,
  files: Record<string, File> = {},
) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (isFileLike(value)) {
      formData.append(key, value);
      return;
    }

    appendFormData(formData, key, value);
  });

  Object.entries(files).forEach(([fieldName, file]) => {
    formData.append(fieldName, file);
  });

  return formData;
};

export const ChurchInfoService = {
  async get(): Promise<CResponse<ChurchInfo>> {
    const response = await HTTP.get<CResponse<ChurchInfo>>("/church-info");

    return {
      ...response.data,
      data: normalizeChurchInfo(response.data.data) ?? ({} as ChurchInfo),
    };
  },

  async update(
    data: UpdateChurchInfoInput,
    files: Record<string, File> = {},
  ): Promise<CResponse<ChurchInfo>> {
    const hasFiles = Object.keys(files).length > 0;
    const payload = hasFiles ? toFormData(data, files) : data;

    const response = await HTTP.patch<CResponse<ChurchInfo>>(
      "/church-info",
      payload,
    );

    return {
      ...response.data,
      data: normalizeChurchInfo(response.data.data) ?? ({} as ChurchInfo),
    };
  },
};
