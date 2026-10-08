import { computed, ref } from "vue";

import { ChurchInfoService } from "~/services/church-info.service";
import { UserRole } from "~/services/users.service";
import { useChurchInfoStore } from "~/stores/church-info.store";
import { useUserStore } from "~/stores/user.store";

export type ChurchHeroImageField =
  | "aboutHeroImage"
  | "giveHeroImage"
  | "eventHeroImage"
  | "galleryHeroImage"
  | "ministryHeroImage"
  | "sermonsHeroImage";

export const useChurchHeroImage = (field: ChurchHeroImageField) => {
  const churchInfoStore = useChurchInfoStore();
  const userStore = useUserStore();
  const canEdit = computed(() => userStore.user?.role === UserRole.ROOT);
  const isSaving = ref(false);
  const error = ref("");

  const saveImage = async (file: File) => {
    isSaving.value = true;
    error.value = "";

    try {
      const response = await ChurchInfoService.update({}, { [field]: file });
      churchInfoStore.churchInfo = {
        ...churchInfoStore.churchInfo,
        ...response.data,
      };
      return true;
    } catch {
      error.value = "Unable to update this page image. Please try again.";
      return false;
    } finally {
      isSaving.value = false;
    }
  };

  return { churchInfoStore, canEdit, isSaving, error, saveImage };
};
