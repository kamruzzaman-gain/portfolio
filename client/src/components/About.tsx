import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import type { UserProfile, Skill } from "@shared/schema";

export function About() {
  const { data: profile, isLoading: profileLoading } = useQuery<UserProfile>({
    queryKey: ["/api/profile"],
  });

  const { data: skills, isLoading: skillsLoading } = useQuery<Skill[]>({
    queryKey: ["/api/skills"],
  });

  if (profileLoading || skillsLoading) {
    return <div className="py-20 bg-background">Loading...</div>;
  }

  const skillCategories = skills?.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>) || {};

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">About Me</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get to know more about my journey, passion, and the skills I bring to every project.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-6 text-primary">My Story</h3>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-muted-foreground mb-4">
                {profile?.fullBio || "With over 5 years of experience in full-stack development, I've had the privilege of working with startups and established companies to bring innovative ideas to life. My journey began with a computer science degree, but my real education came from building real-world applications."}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="bg-primary/10 text-primary px-4 py-2 text-sm">
                🎯 Problem Solver
              </Badge>
              <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-4 py-2 text-sm">
                🚀 Innovation Focused
              </Badge>
              <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-2 text-sm">
                🌱 Continuous Learner
              </Badge>
            </div>
          </motion.div>

          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-8 text-primary">Skills & Technologies</h3>
            
            {Object.entries(skillCategories).map(([category, categorySkills]) => (
              <div key={category} className="mb-8">
                <h4 className="text-lg font-semibold mb-4 text-muted-foreground capitalize">
                  {category}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {categorySkills.map((skill) => (
                    <motion.div
                      key={skill.id}
                      className="bg-muted/50 dark:bg-muted/20 rounded-lg p-4 text-center hover:bg-primary/10 hover:border-primary/20 transition-all duration-200 hover:scale-105 cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {skill.icon && (
                        <div className="text-3xl mb-2">{skill.icon}</div>
                      )}
                      <div className="font-semibold text-sm">{skill.name}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
