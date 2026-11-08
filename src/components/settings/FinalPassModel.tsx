import React from "react";
import { useTranslation } from "react-i18next";
import { Dropdown } from "../ui/Dropdown";
import { SettingContainer } from "../ui/SettingContainer";
import { useSettings } from "../../hooks/useSettings";
import { useModelStore } from "../../stores/modelStore";

interface FinalPassModelProps {
  descriptionMode?: "tooltip" | "inline";
  grouped?: boolean;
}

const OFF = "__off__";

export const FinalPassModel: React.FC<FinalPassModelProps> = ({
  descriptionMode = "tooltip",
  grouped = false,
}) => {
  const { t } = useTranslation();
  const { getSetting, updateSetting, isUpdating } = useSettings();
  const { models } = useModelStore();
  const current = (getSetting("final_pass_model") as string | null) ?? null;

  const options = [
    { value: OFF, label: t("settings.advanced.finalPassModel.none") },
    ...models
      .filter((m) => m.is_downloaded)
      .map((m) => ({ value: m.id, label: m.name })),
  ];

  return (
    <SettingContainer
      title={t("settings.advanced.finalPassModel.title")}
      description={t("settings.advanced.finalPassModel.description")}
      descriptionMode={descriptionMode}
      grouped={grouped}
      layout="horizontal"
    >
      <Dropdown
        options={options}
        selectedValue={current ?? OFF}
        onSelect={(value) =>
          updateSetting("final_pass_model", value === OFF ? null : value)
        }
        disabled={isUpdating("final_pass_model")}
      />
    </SettingContainer>
  );
};
