import { router } from "expo-router";

import { IslandCard } from "@/components/pathway/IslandCard";
import { Screen } from "@/components/ui/Screen";
import { Body, Title } from "@/components/ui/Text";
import { colors } from "@/constants/theme";
import { islandCompletion } from "@/lib/progress";
import { useProgressStore } from "@/store/useProgressStore";

const accents = [colors.ember, colors.ocean, colors.moss, colors.plum];

export default function PathwayScreen() {
  const { islands, exercises, progress } = useProgressStore();
  const favorites = exercises.filter((exercise) => progress[exercise.id]?.is_favorited);

  return (
    <Screen>
      <Title>Pathway</Title>
      <Body>Choose an island, unlock nodes in order, and pass each checkpoint to keep moving.</Body>
      {favorites.length > 0 ? (
        <IslandCard
          title="Favorites"
          description="Your saved exercises for quick practice."
          percent={100}
          completed={favorites.length}
          total={favorites.length}
          accent={colors.gold}
          onPress={() => router.push("/island/favorites")}
        />
      ) : null}
      {islands.map((island, index) => {
        const completion = islandCompletion(island.id, exercises, progress);
        return (
          <IslandCard
            key={island.id}
            title={island.title}
            description={island.description}
            percent={completion.percent}
            completed={completion.completed}
            total={completion.total}
            accent={accents[index % accents.length]}
            onPress={() => router.push(`/island/${island.id}`)}
          />
        );
      })}
    </Screen>
  );
}
