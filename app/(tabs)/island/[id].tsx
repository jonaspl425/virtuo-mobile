import { useLocalSearchParams } from "expo-router";

import { NodeMap } from "@/components/pathway/NodeMap";
import { Screen } from "@/components/ui/Screen";
import { Body, Title } from "@/components/ui/Text";
import { useProgressStore } from "@/store/useProgressStore";

export default function IslandScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { islands, exercises, progress } = useProgressStore();
  const island = islands.find((item) => item.id === id);
  const islandExercises =
    id === "favorites"
      ? exercises.filter((exercise) => progress[exercise.id]?.is_favorited)
      : exercises.filter((exercise) => exercise.island_id === id);

  return (
    <Screen>
      <Title>{id === "favorites" ? "Favorites" : island?.title ?? "Island"}</Title>
      <Body>{id === "favorites" ? "Quick access to the exercises you saved." : island?.description ?? "Complete nodes from top to bottom."}</Body>
      <NodeMap exercises={islandExercises} progress={progress} />
    </Screen>
  );
}
