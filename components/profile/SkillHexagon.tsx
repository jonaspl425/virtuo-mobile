import Svg, { Circle, Line, Polygon, Text as SvgText } from "react-native-svg";
import { StyleSheet, View } from "react-native";

import { colors } from "@/constants/theme";

const labels = ["Clarity", "Confidence", "Structure", "Vocab", "Pacing", "Story"];

export function SkillHexagon({ values }: { values: number[] }) {
  const center = 120;
  const radius = 78;
  const points = values.map((value, index) => point(index, radius * value, center)).join(" ");
  const outer = values.map((_, index) => point(index, radius, center)).join(" ");

  return (
    <View style={styles.wrap}>
      <Svg width="100%" height="100%" viewBox="0 0 240 240">
        <Polygon points={outer} fill="#fff7e8" stroke={colors.line} strokeWidth="2" />
        {labels.map((label, index) => {
          const axis = point(index, radius, center).split(",").map(Number);
          const labelPoint = point(index, radius + 23, center).split(",").map(Number);
          return (
            <GLine key={label} x={axis[0]} y={axis[1]} labelX={labelPoint[0]} labelY={labelPoint[1]} label={label} />
          );
        })}
        <Polygon points={points} fill="rgba(232, 93, 4, 0.34)" stroke={colors.ember} strokeWidth="3" />
        <Circle cx={center} cy={center} r="3" fill={colors.ink} />
      </Svg>
    </View>
  );
}

function GLine({ x, y, labelX, labelY, label }: { x: number; y: number; labelX: number; labelY: number; label: string }) {
  return (
    <>
      <Line x1="120" y1="120" x2={x} y2={y} stroke={colors.line} strokeWidth="1" />
      <SvgText x={labelX} y={labelY} fill={colors.muted} fontSize="10" fontWeight="700" textAnchor="middle">
        {label}
      </SvgText>
    </>
  );
}

function point(index: number, radius: number, center: number) {
  const angle = (Math.PI * 2 * index) / 6 - Math.PI / 2;
  return `${center + radius * Math.cos(angle)},${center + radius * Math.sin(angle)}`;
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    aspectRatio: 1.25,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white
  }
});
