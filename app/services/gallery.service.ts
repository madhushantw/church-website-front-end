import { HTTP } from "./http";
import type { CResponse } from "./interfaces/Response.interface";

export enum GalleryImageType {
  WORSHIP = "worship",
  COMMUNITY = "community",
  EVENTS = "event",
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  imageType: GalleryImageType;
}

export interface CreateGallery {
  title: string;
  description?: string | null;
  type: GalleryImageType;
  image: File;
}

const getImageUrl = (imageUrl: string) => {
  const config = useRuntimeConfig();

  return `${config.public.apiBaseUrl}${imageUrl}`;
};

export const GalleryService = {
  async getAll(): Promise<CResponse<GalleryItem[]>> {
    const response = await HTTP.get<CResponse<GalleryItem[]>>("/gallery");

    return {
      ...response.data,
      data: response.data.data.map((item) => ({
        ...item,
        imageUrl: getImageUrl(item.imageUrl),
      })),
    };
  },

  async getById(id: string): Promise<CResponse<GalleryItem>> {
    const response = await HTTP.get<CResponse<GalleryItem>>(`/gallery/${id}`);

    return {
      ...response.data,
      data: {
        ...response.data.data,
        imageUrl: getImageUrl(response.data.data.imageUrl),
      },
    };
  },

  async create(data: CreateGallery): Promise<CResponse<GalleryItem>> {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("type", data.type);
    formData.append("image", data.image);

    if (data.description) {
      formData.append("description", data.description);
    }

    const response = await HTTP.post<CResponse<GalleryItem>>(
      "/gallery",
      formData,
    );

    return response.data;
  },

  delete(id: string) {
    return HTTP.delete(`/gallery/${id}`);
  },
};
