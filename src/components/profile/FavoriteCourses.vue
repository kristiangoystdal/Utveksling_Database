<template>
  <div class="favorite-courses">
    <h2>Favorite Courses</h2>
    <div>
      <v-btn color="primary" class="btn mb-4" @click="exportAsPDF"> Export as PDF </v-btn>
      <v-btn color="secondary" class="btn mb-4" @click="exportAsCSV"> Export as CSV </v-btn>
    </div>

    <v-sheet elevation="4" v-if="favoriteCourses.length">
      <!-- TABS -->
      <v-tabs v-model="tab" color="primary" center-active>
        <v-tab v-for="(courses, university) in tabbedCourses" :key="university" :value="university">
          {{ university }}
        </v-tab>
      </v-tabs>

      <v-divider></v-divider>

      <!-- TAB CONTENT -->
      <v-window v-model="tab">
        <v-window-item v-for="(courses, university) in tabbedCourses" :key="university" :value="university">
          <v-sheet class="pa-4">
            <v-row no-gutters>
              <v-col cols="3">
                <strong>{{ this.$t('database.totalCourses') }}</strong>:
              </v-col>
              <v-col cols="3">
                {{ courses.length }}
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="3">
                <strong>{{ this.$t('database.totalECTS') }}</strong>:
              </v-col>
              <v-col cols="3">
                {{courses.reduce((sum, course) => sum + Number(course.ECTSPoints), 0)}}
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="3">
                <strong>{{ this.$t('database.country') }}</strong>:
              </v-col>
              <v-col cols="3">
                {{ courses[0].country ? this.$t('countries.' + courses[0].country) : 'N/A' }}
              </v-col>
            </v-row>

            <v-divider class="my-4"></v-divider>
            <div v-for="course in courses" :key="course.id" class="my-4">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <strong>{{ course.courseName }}</strong> ({{ course.courseCode }})<br />
                  <span v-if="course.replacedCourseName">{{ course.replacedCourseName }}</span>
                  <span v-if="course.replacedCourseCode"> ({{ course.replacedCourseCode }})<br /></span>
                  <span v-if="course.institute">{{ course.institute }}<br /></span>
                  <span v-if="course.ECTSPoints">{{ course.ECTSPoints }} ECTS – </span>
                  <span v-if="course.courseType">{{ course.courseType }} – </span>
                  <span v-if="course.year">{{ course.year }}</span> <br />
                  <!-- <strong>{{ course.country ? course.country : '' }}</strong> <br> -->
                  <!-- {{ course.university ? '– ' + course.university : '' }}<br /> -->
                  <span v-if="course.comments"><em>{{ $t('database.comments') }}: {{ course.comments
                  }}</em></span><br />
                </div>
                <v-icon @click="toggleFavorite(course)" :color="checkIfFavorite(course) ? 'red' : 'grey'"
                  style="cursor: pointer;">
                  mdi-heart
                </v-icon>
              </div>
              <v-divider class="my-4"></v-divider>
            </div>
          </v-sheet>
        </v-window-item>
      </v-window>
    </v-sheet>

    <p v-else>No courses favorited yet</p>
  </div>
</template>

<script>
import { db, auth } from "../../js/firebaseConfig";
import { ref as dbRef, get, set } from "firebase/database";

export default {
  name: "FavoriteCourses",
  data() {
    return {
      favoriteCourses: [],
      tab: null,
    };
  },
  async created() {
    const user = auth.currentUser;
    if (user) {
      const snapshot = await get(dbRef(db, `users/${user.uid}/favoriteCourses`));
      const courses = snapshot.val();
      this.favoriteCourses = courses
        ? Object.keys(courses).map((key) => ({ id: key, ...courses[key] }))
        : [];
    } else {
      this.favoriteCourses = [];
    }
  },
  computed: {
    tabbedCourses() {
      const tabs = {};
      this.favoriteCourses.forEach(course => {
        if (!tabs[course.university]) tabs[course.university] = [];
        tabs[course.university].push(course);
      });

      // If no tab selected yet → select the first university
      if (!this.tab && Object.keys(tabs).length > 0) {
        this.tab = Object.keys(tabs)[0];
      }

      return tabs;
    },

  },
  methods: {
    exportAsCSV() {
      if (this.favoriteCourses.length === 0) {
        alert("No favorite courses to export.");
        return;
      }

      const header = [
        "Course Name",
        "Course Code",
        "Replaced Course Name",
        "Replaced Course Code",
        "Institute",
        "ECTS Points",
        "Course Type",
        "Year",
        "Comments",
      ];
      const rows = this.favoriteCourses.map((course) => [
        course.courseName,
        course.courseCode,
        course.replacedCourseName,
        course.replacedCourseCode,
        course.institute,
        course.ECTSPoints,
        course.courseType,
        course.year,
        course.comments || "",
      ]);

      const csvContent =
        "data:text/csv;charset=utf-8," +
        [header, ...rows].map((e) => e.join(",")).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "favorite_courses.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    exportAsPDF() {
      if (this.favoriteCourses.length === 0) {
        alert("No favorite courses to export.");
        return;
      }

      import("jspdf").then(({ jsPDF }) => {
        const doc = new jsPDF();
        let yOffset = 10;

        this.favoriteCourses.forEach((course, index) => {
          const wrapText = (text, x, y, maxWidth) => {
            const lines = doc.splitTextToSize(text, maxWidth);
            lines.forEach((line) => {
              if (y > 270) { // Check if yOffset exceeds page height
                doc.addPage();
                y = 10; // Reset yOffset for the new page
              }
              doc.text(line, x, y);
              y += 10;
            });
            return y;
          };

          yOffset = wrapText(`Course Name: ${course.courseName}`, 10, yOffset, 180);
          yOffset = wrapText(`Course Code: ${course.courseCode}`, 10, yOffset, 180);
          yOffset = wrapText(
            `Replaced Course: ${course.replacedCourseName} – ${course.replacedCourseCode}`,
            10,
            yOffset,
            180
          );
          yOffset = wrapText(`Institute: ${course.institute}`, 10, yOffset, 180);
          yOffset = wrapText(`ECTS Points: ${course.ECTSPoints}`, 10, yOffset, 180);
          yOffset = wrapText(`Course Type: ${course.courseType}`, 10, yOffset, 180);
          yOffset = wrapText(`Year: ${course.year}`, 10, yOffset, 180);
          yOffset = wrapText(`Comments: ${course.comments || "N/A"}`, 10, yOffset, 180);
          yOffset += 10;

          if (yOffset > 270) {
            doc.addPage();
            yOffset = 10;
          }
        });

        doc.save("favorite_courses.pdf");
      });
    },
    checkIfFavorite(course) {
      return this.favoriteCourses.some(favCourse =>
        Object.keys(course).every(key => course[key] === favCourse[key])
      );
    },
    toggleFavorite(course) {
      const user = auth.currentUser;

      if (!user) {
        alert(this.$t("exchanges.loginToFavorite"));
        return;
      }

      // Add course to favorites if not already favorited, else remove it
      if (!this.checkIfFavorite(course)) {
        this.favoriteCourses.push(course);
      } else {
        this.favoriteCourses = this.favoriteCourses.filter(favCourse =>
          !Object.keys(course).every(key => course[key] === favCourse[key])
        );
      }

      this.saveFavoriteCourses().catch(error => {
        alert(this.$t("exchanges.errorSavingFavorites"));
        console.error("Error saving favorite courses:", error);
      });
    },
    async loadFavoriteCourses() {
      const user = auth.currentUser;
      if (!user) {
        this.favoriteCourses = [];
        return;
      }
      const snapshot = await get(dbRef(db, `users/${user.uid}/favoriteCourses`));
      const courses = snapshot.val();
      this.favoriteCourses = courses
        ? Object.keys(courses).map((key) => ({ id: key, ...courses[key] }))
        : [];
    },
    async saveFavoriteCourses() {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = dbRef(db, `users/${user.uid}/favoriteCourses`);
      const updates = {};

      this.favoriteCourses.forEach((course, index) => {
        updates[index] = course;
      });

      await set(userRef, updates);
    },
  },
};
</script>


<style scoped>
.favorite-courses {
  margin-top: 20px;
}

.favorite-courses h2 {
  font-size: 1.5em;
  margin-bottom: 10px;
}

.favorite-courses ul {
  list-style-type: none;
  padding: 0;
}

.favorite-courses li {
  padding: 5px 0;
}
</style>