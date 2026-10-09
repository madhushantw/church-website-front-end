import { HTTP } from "./http";
import type {
  PaginationOptions,
  PaginationResponse,
} from "./interfaces/pagination.interface";
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

export interface GalleryFindAllOptions extends PaginationOptions {
  type?: GalleryImageType
}

const getImageUrl = (imageUrl: string) => {
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl

  const baseUrl = HTTP.defaults.baseURL
  return baseUrl ? `${baseUrl.replace(/\/$/, '')}${imageUrl}` : imageUrl
}

export const GalleryService = {
  async getAll(params: GalleryFindAllOptions) {
    const response = await HTTP.get<PaginationResponse<GalleryItem>>(
      "/gallery",
      { params },
    );

    return {
      ...response.data,
      data: {
        ...response.data.data,
        items: response.data.data.items.map((item) => ({
          ...item,
          imageUrl: getImageUrl(item.imageUrl),
        })),
      },
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

    return {
      ...response.data,
      data: {
        ...response.data.data,
        imageUrl: getImageUrl(response.data.data.imageUrl),
      },
    };
  },

  async delete(ids: string | string[]) {
    return HTTP.delete("/gallery", {
      data: {
        ids: Array.isArray(ids) ? ids : [ids],
      },
    });
  },
};
