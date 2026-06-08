"use client";

/**
 * React-PDF document for the Career Roadmap takeaway. Rendered client-side via
 * @react-pdf/renderer; lazy-loaded by PdfDownload so the heavy renderer bundle
 * only loads when a visitor actually asks for the PDF.
 */

import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { getSkillGap, categoryById } from "@/lib/data";
import {
  MASTERY_NAMES,
  MASTERY_PERCENT,
  Person,
  Role,
} from "@/lib/types";

// React-PDF doesn't accept Tailwind — its own StyleSheet only.
const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 40,
    fontFamily: "Helvetica",
    color: "#1f1a1a",
    backgroundColor: "#faf8f6",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    letterSpacing: 2,
    color: "#5a5454",
    textTransform: "uppercase",
    marginBottom: 24,
  },
  personRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 24,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#bb342f",
    color: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 24,
    fontWeight: "bold",
  },
  personName: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
  },
  personMeta: {
    fontSize: 10,
    color: "#5a5454",
    marginTop: 2,
  },
  goalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 6,
  },
  goalLabel: {
    fontSize: 10,
    color: "#5a5454",
  },
  goalTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
  },
  readiness: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#bb342f",
  },
  progressTrack: {
    height: 6,
    backgroundColor: "#e6e2db",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 28,
  },
  progressFill: {
    height: 6,
    backgroundColor: "#bb342f",
    borderRadius: 3,
  },
  sectionTitle: {
    fontSize: 9,
    letterSpacing: 1.5,
    color: "#5a5454",
    textTransform: "uppercase",
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
  },
  twoCol: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  col: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    border: "1pt solid #d6d2cc",
    backgroundColor: "#ffffff",
  },
  skillRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    fontSize: 10,
  },
  skillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  bonusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    fontSize: 9,
    color: "#5a5454",
    marginBottom: 16,
  },
  bonusLabel: {
    fontFamily: "Helvetica-Bold",
    marginRight: 6,
  },
  footer: {
    marginTop: "auto",
    paddingTop: 14,
    borderTop: "1pt solid #d6d2cc",
    fontSize: 8,
    color: "#5a5454",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

interface Props {
  person: Person;
  role: Role;
}

export default function RoadmapPDF({ person, role }: Props) {
  const { acquired, missing, niceMissing, readiness } = getSkillGap(
    person,
    role
  );
  const pct = Math.round(readiness * 100);

  return (
    <Document
      title={`Skill Tree · ${person.name}`}
      author="HR Learning Festival"
      subject={`Career roadmap toward ${role.title}`}
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text>Career Roadmap</Text>
          <Text>HR Learning Festival 2026</Text>
        </View>

        <View style={styles.personRow}>
          <View style={styles.avatar}>
            <Text>{initials(person.name)}</Text>
          </View>
          <View>
            <Text style={styles.personName}>{person.name}</Text>
            <Text style={styles.personMeta}>
              {person.currentRole} · {person.yearsExperience} yrs ·{" "}
              {person.skills.length} skills
            </Text>
          </View>
        </View>

        <View style={styles.goalRow}>
          <View style={{ flexDirection: "row", alignItems: "baseline" }}>
            <Text style={styles.goalLabel}>Targeting </Text>
            <Text style={styles.goalTitle}>{role.title}</Text>
          </View>
          <Text style={styles.readiness}>{pct}% ready</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${pct}%` }]} />
        </View>

        <View style={styles.twoCol}>
          <View style={styles.col}>
            <Text style={styles.sectionTitle}>Already in your tree</Text>
            {acquired.length === 0 && (
              <Text style={{ fontSize: 10, color: "#5a5454" }}>
                Starting fresh!
              </Text>
            )}
            {acquired.slice(0, 8).map((s) => {
              const cat = categoryById[s.category];
              const level = person.skills.find((x) => x.id === s.id)?.level ?? 0;
              return (
                <View key={s.id} style={styles.skillRow}>
                  <View
                    style={[styles.skillDot, { backgroundColor: cat.color }]}
                  />
                  <Text>
                    {s.name}{" "}
                    <Text style={{ color: "#5a5454" }}>
                      · {MASTERY_NAMES[level as 0 | 1 | 2 | 3]}
                    </Text>
                  </Text>
                </View>
              );
            })}
            {acquired.length > 8 && (
              <Text style={{ fontSize: 9, color: "#5a5454", marginTop: 4 }}>
                + {acquired.length - 8} more
              </Text>
            )}
          </View>

          <View style={styles.col}>
            <Text style={styles.sectionTitle}>Next to learn</Text>
            {missing.length === 0 && (
              <Text style={{ fontSize: 10, color: "#3a7a3a" }}>
                You're ready!
              </Text>
            )}
            {missing.slice(0, 8).map((s) => {
              const cat = categoryById[s.category];
              return (
                <View key={s.id} style={styles.skillRow}>
                  <View
                    style={[
                      styles.skillDot,
                      { backgroundColor: "#ffffff", borderWidth: 1, borderColor: cat.color },
                    ]}
                  />
                  <Text>{s.name}</Text>
                </View>
              );
            })}
            {missing.length > 8 && (
              <Text style={{ fontSize: 9, color: "#5a5454", marginTop: 4 }}>
                + {missing.length - 8} more
              </Text>
            )}
          </View>
        </View>

        {niceMissing.length > 0 && (
          <View style={styles.bonusRow}>
            <Text style={styles.bonusLabel}>Bonus picks: </Text>
            <Text>
              {niceMissing
                .slice(0, 5)
                .map((s) => s.name)
                .join(" · ")}
            </Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text>Generated at the HR Learning Festival booth</Text>
          <Text>Use this to plan with your L&D team</Text>
        </View>
      </Page>
    </Document>
  );
}

function initials(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}
