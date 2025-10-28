<template>
  <div class="favorite-courses">
    <h2>Favorite Courses</h2>
    <ul v-if="favoriteCourses.length">
      <li v-for="course in favoriteCourses" :key="course.id" class="favorite-course-item">
        <strong>{{ course.courseName }}</strong> ({{ course.courseCode }})<br />
        {{ course.replacedCourseName }} – {{ course.replacedCourseCode }}<br />
        {{ course.institute }}<br />
        {{ course.ETCSPoints }} ECTS – {{ course.courseType }} – {{ course.year }}
        <hr />
      </li>
    </ul>
    <p v-else>No courses favorited yet</p>
  </div>
</template>

<script>
import { db, auth } from "../../js/firebaseConfig";
import { ref as dbRef, get } from "firebase/database";

export default {
  name: "FavoriteCourses",
  data() {
    return {
      favoriteCourses: [],
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