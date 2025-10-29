<template>
  <div class="favorite-courses">
    <h2>Favorite Courses</h2>
    <div>
      <v-btn color="primary" class="btn mb-4" @click="exportAsPDF"> Export as PDF </v-btn>
      <v-btn color="secondary" class="btn mb-4" @click="exportAsCSV"> Export as CSV </v-btn>
    </div>
    <ul v-if="favoriteCourses.length">
      <li v-for="course in favoriteCourses" :key="course.id" class="favorite-course-item">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <strong>{{ course.courseName }}</strong> ({{ course.courseCode }})<br />
            {{ course.replacedCourseName }} – {{ course.replacedCourseCode }}<br />
            {{ course.institute }}<br />
            {{ course.ETCSPoints }} ECTS – {{ course.courseType }} – {{ course.year }}
          </div>
          <v-icon @click="toggleFavorite(course)" :color="checkIfFavorite(course) ? 'red' : 'grey'"
            style="cursor: pointer;">
            mdi-heart
          </v-icon>
        </div>
        <hr />
      </li>
    </ul>
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
      favoriteCourses: []
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
        "ETCS Points",
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
        course.ETCSPoints,
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
          yOffset = wrapText(`ETCS Points: ${course.ETCSPoints}`, 10, yOffset, 180);
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