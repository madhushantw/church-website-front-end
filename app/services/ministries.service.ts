import { HTTP } from "./http";

import type {
  PaginationOptions,
  PaginationResponse,
} from "./interfaces/pagination.interface";

import type { CResponse } from "./interfaces/Response.interface";

export enum MinistryType {
  GENERAL = "general",
  CHILDREN = "children",
  YOUTH = "youth",
  WOMEN = "women",
  MEN = "men",
  WORSHIP = "worship",
  OUTREACH = "outreach",
  PRAYER = "prayer",
  MEDIA = "media",
}

export interface MinistryItem {
  id: string;
  name: string;
  type: MinistryType;
  description: string | null;
  image: string | null;
  leader: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMinistry {
  name: string;
  type?: MinistryType;
  description?: string | null;
  image?: File | null;
  leader?: string | null;
}

export type UpdateMinistry = Partial<Omit<CreateMinistry, "image">> & {
  image?: File;
};

const toFormData = (data: CreateMinistry | UpdateMinistry): FormData => {
  const formData = new FormData();
  if (data.name !== undefined) formData.append("name", data.name);
  if (data.type !== undefined) formData.append("type", data.type);
  if (data.description !== undefined && data.description !== null) formData.append("description", data.description);
  if (data.leader !== undefined && data.leader !== null) formData.append("leader", data.leader);
  if (data.image) formData.append("image", data.image);
  return formData;
};


const getImageUrl = (imageUrl: string | null) => {
  if(!imageUrl) return null
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl

  const baseUrl = HTTP.defaults.baseURL
  return baseUrl ? `${baseUrl.replace(/\/$/, '')}${imageUrl}` : imageUrl
}

const normalizeMinistry = (item: MinistryItem): MinistryItem => ({
  ...item,
  image: getImageUrl(item.image),
});

export const MinistriesService = {
  async getAll(
    params: PaginationOptions,
  ): Promise<PaginationResponse<MinistryItem>> {
    const response = await HTTP.get<PaginationResponse<MinistryItem>>(
      "/ministries",
      { params },
    );

    return {
      ...response.data,
      data: {
        ...response.data.data,
        items: response.data.data.items.map(normalizeMinistry),
      },
    };
  },

  async getById(id: string): Promise<CResponse<MinistryItem>> {
    const response = await HTTP.get<CResponse<MinistryItem>>(
      `/ministries/${id}`,
    );

    return {
      ...response.data,
      data: normalizeMinistry(response.data.data),
    };
  },

  async create(data: CreateMinistry): Promise<CResponse<MinistryItem>> {
    const response = await HTTP.post<CResponse<MinistryItem>>(
      "/ministries",
      toFormData(data),
    );

    return {
      ...response.data,
      data: normalizeMinistry(response.data.data),
    };
  },

  async update(
    id: string,
    data: UpdateMinistry,
  ): Promise<CResponse<MinistryItem>> {
    const response = await HTTP.patch<CResponse<MinistryItem>>(
      `/ministries/${id}`,
      toFormData(data),
    );

    return {
      ...response.data,
      data: normalizeMinistry(response.data.data),
    };
  },

  delete(id: string) {
    return HTTP.delete(`/ministries/${id}`);
  },
};
