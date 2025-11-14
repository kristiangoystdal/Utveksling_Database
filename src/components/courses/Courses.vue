<template>
  <div>
    <h2>{{ $t("courses.pageHeader") }}</h2>
    <br />
    <p class="box box-third-color preserve-whitespace text-center">
      {{ $t("courses.info") }}
    </p>
  </div>
  <br />

  <!-- Search Field -->
  <v-text-field v-model="courseSearch" :label="$t('courses.search')" prepend-inner-icon="mdi-magnify" variant="outlined"
    hide-details single-line density="compact"
    style="width: 95%; margin: 10px auto; border-radius: 5px;"></v-text-field>
  <br />

  <!-- Data Table -->
  <div v-if="!isMobile">
    <v-data-table v-model:expanded="expanded" :headers="translatedHeaders" :items="courseList" item-value="courseCode"
      show-expand class="main-table" id="main-table-width" :search="courseSearch">


      <template v-slot:expanded-row="{ columns, item }">
        <tr>
          <td :colspan="columns.length" id="coursesStyle">
            <div>
              <br />
              <v-data-table-virtual v-if="
                item.courses
              " :headers="translatedHeadersCourses" :items="item.courses" item-value="name" dense
                class="virtual-table">
                <template v-slot:item.comment="{ item }">
                  <v-icon v-if="item.comments && item.comments.trim() !== ''" small class="mr-2"
                    @click="showComments(item)">
                    mdi-comment
                  </v-icon>
                  <v-icon v-else small class="mr-2"> mdi-comment-off </v-icon>
                </template>
                <template v-slot:item.favorite="{ item }">
                  <v-icon v-if="!checkIfFavorite(item)" small class="mr-2" @click="toggleFavorite(item)">
                    mdi-heart-outline
                  </v-icon>
                  <v-icon v-else small class="mr-2" color="red" @click="toggleFavorite(item)">
                    mdi-heart
                  </v-icon>
                </template>
              </v-data-table-virtual>
              <br />
            </div>
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>

  <div v-else>
    <v-data-table :headers="translatedMobileHeaders" v-model:expanded="expanded" :items="courseList" item-value="id"
      show-expand class="main-table fixed-table" id="main-table-width" :fixed-header="false" :style="{ width: '100%' }"
      item-class="custom-item-class" header-class="custom-header-class">
      <template v-slot:item.country="{ item }">
        <div style="display: flex; align-items: center">
          <img :src="getFlagUrl(item.country)" alt="Flag" width="20" height="15" style="margin-left: 8px" />
        </div>
      </template>

      <template v-slot:expanded-row="{ columns, item }">
        <tr>
          <td :colspan="translatedMobileHeaders.length + 1">
            <div class="expanded-content">
              <div>
                <div class="text-underline text-medium">
                  {{ $t("exchanges.courseInformation") }}
                </div>
                <v-container>
                  <v-row no-gutters>
                    <v-col cols="6" class="text-bold">
                      {{ $t("database.country") }}:
                    </v-col>
                    <v-col cols="6">
                      {{ item.country }}
                    </v-col>
                  </v-row>
                  <v-row no-gutters>
                    <v-col cols="6" class="text-bold">
                      {{ $t("database.specialization") }}:
                    </v-col>
                    <v-col cols="6">
                      {{ item.specialization }}
                    </v-col>
                  </v-row>
                  <v-row no-gutters>
                    <v-col cols="6" class="text-bold">
                      {{ $t("database.numSemesters") }}:
                    </v-col>
                    <v-col cols="6">
                      {{ item.numSemesters }}
                    </v-col>
                  </v-row>
                  <v-row no-gutters>
                    <v-col cols="6" class="text-bold">
                      {{ $t("database.studyYear") }}:
                    </v-col>
                    <v-col cols="6">
                      {{ item.studyYear }}
                    </v-col>
                  </v-row>
                  <br />
                  <div v-if="item.courses.Høst">
                    <v-row no-gutters class="text-bold" style="font-size: 15px; text-decoration: underline">
                      {{ $t("exchanges.coursesFallHeader") }}
                    </v-row>
                    <v-row no-gutters style="margin-bottom: 5px">
                      <v-col cols="5" class="text-bold" style="padding-right: 5px">
                        {{ $t("database.courseName") }}
                      </v-col>
                      <v-col cols="3" class="text-bold" style="padding-right: 5px">
                        {{ $t("database.courseCode") }}
                      </v-col>
                      <v-col cols="4" class="text-bold" style="padding-right: 5px">
                        {{ $t("database.ETCSPoints") }}
                      </v-col>
                    </v-row>
                    <v-row v-for="(course, index) in item.courses.Høst" :key="index" class="mb-3" no-gutters>
                      <v-col cols="5">
                        {{ course.courseName }}
                      </v-col>
                      <v-col cols="3">
                        {{ course.courseCode }}
                      </v-col>
                      <v-col cols="3">
                        {{ course.ETCSPoints }}
                      </v-col>
                      <v-col cols="1">
                        <v-icon small class="mr-2" @click="toggleInformationDialog(course)">
                          mdi-dots-horizontal
                        </v-icon>
                      </v-col>
                    </v-row>
                  </div>
                  <div v-if="item.courses.Vår && item.courses.Vår.length > 0">
                    <v-row no-gutters class="text-bold" style="font-size: 15px; text-decoration: underline">
                      {{ $t("exchanges.coursesSpringHeader") }}
                    </v-row>
                    <v-row no-gutters style="margin-bottom: 5px">
                      <v-col cols="5" class="text-bold" style="padding-right: 5px">
                        {{ $t("database.courseName") }}
                      </v-col>
                      <v-col cols="3" class="text-bold" style="padding-right: 5px">
                        {{ $t("database.courseCode") }}
                      </v-col>
                      <v-col cols="4" class="text-bold" style="padding-right: 5px">
                        {{ $t("database.ETCSPoints") }}
                      </v-col>
                    </v-row>
                    <v-row v-for="(course, index) in item.courses.Vår" :key="index" class="mb-3" no-gutters>
                      <v-col cols="5">
                        {{ course.courseName }}
                      </v-col>
                      <v-col cols="3">
                        {{ course.courseCode }}
                      </v-col>
                      <v-col cols="3">
                        {{ course.ETCSPoints }}
                      </v-col>
                      <v-col cols="1">
                        <v-icon small class="mr-2" @click="toggleInformationDialog(course)">
                          mdi-dots-horizontal
                        </v-icon>
                      </v-col>
                    </v-row>
                  </div>
                </v-container>
              </div>
            </div>
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>

  <!-- Comment Dialog -->
  <v-dialog v-model="commentDialog" max-width="500px" class="dialog">
    <v-card>
      <v-card-title>
        {{ $t("exchanges.courseComments") }} {{ currentCourseName }}
      </v-card-title>
      <v-card-text>{{ currentComments }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="btn btn-secondary" text @click="closeCommentDialog">
          {{ $t("operations.close") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Information Dialog -->
  <v-dialog v-model="informationDialog" max-width="500px" class="dialog">
    <v-card>
      <v-card-title>
        {{ $t("exchanges.courseInformation") }}
      </v-card-title>
      <v-card-text>
        <v-row no-gutters>
          <v-col cols="12" class="text-bold">
            {{ $t("database.institute") }}:
          </v-col>
          <v-col cols="12">
            {{ currentCourse.institute }}
          </v-col>
        </v-row>
        <v-row no-gutters style="margin-top: 5px">
          <v-col cols="12" class="text-bold">
            {{ $t("database.replacedCourseName") }}:
          </v-col>
          <v-col cols="12">
            {{ currentCourse.replacedCourseName }}
          </v-col>
        </v-row>
        <v-row no-gutters style="margin-top: 5px">
          <v-col cols="12" class="text-bold">
            {{ $t("database.replacedCourseCode") }}:
          </v-col>
          <v-col cols="12">
            {{ currentCourse.replacedCourseCode }}
          </v-col>
        </v-row>
        <v-row no-gutters style="margin-top: 5px">
          <v-col cols="12" class="text-bold">
            {{ $t("database.courseType") }}:
          </v-col>
          <v-col cols="12">
            {{ currentCourse.courseType }}
          </v-col>
        </v-row>
        <v-row no-gutters style="margin-top: 5px">
          <v-col cols="12" class="text-bold">
            {{ $t("database.comments") }}:
          </v-col>
          <v-col cols="12" v-if="currentCourse.comments">
            {{ currentCourse.comments }}
          </v-col>
          <v-col cols="12" v-else>
            {{ $t("exchanges.noComments") }}
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="btn btn-secondary" text @click="toggleInformationDialog">
          {{ $t("operations.close") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { db, auth } from "../../js/firebaseConfig.js";
import { set, get, child, ref as dbRef } from "firebase/database";
import { useI18n } from "vue-i18n";
import { getCode } from "country-list";
import countriesInformation from "../../data/countriesInformation.json";

export default {
  setup() {
    const { t, locale } = useI18n();
    const user = auth.currentUser;
    return { t, locale, user };
  },
  data() {
    return {
      countriesInfo: countriesInformation,
      showFilters: false,
      expanded: [],
      courseList: [],
      commentDialog: false,
      currentComments: "",
      currentCourseName: "",
      screenWidth: window.innerWidth,
      informationDialog: false,
      currentCourse: null,
      favoriteCourses: [],
      courseSearch: "",
    };
  },
  created() {
    this.fetchExchangeData();
    this.loadFavoriteCourses();
  },
  mounted() {
    this.getValuesFromDatabase();
    window.addEventListener("resize", this.updateScreenWidth);
    this.updateScreenWidth();
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.updateScreenWidth);
  },
  watch: {
    locale(newLocale, oldLocale) {
      this.fetchExchangeData();
      this.getValuesFromDatabase();
    },
  },
  computed: {
    isMobile() {
      return this.screenWidth <= 768;
    },
    translatedHeaders() {
      return [
        {
          align: "center",
          key: "",
        },
        {
          title: this.t("database.courseCode"),
          align: "start",
          key: "courseCode",
          length: 1,
        },
        {
          title: this.t("database.courseName"),
          align: "end",
          key: "courseName",
        },
      ];
    },
    translatedHeadersCourses() {
      return [
        {
          title: this.t("database.courseCode"),
          align: "start",
          key: "courseCode",
        },
        {
          title: this.t("database.courseName"),
          align: "start",
          key: "courseName",
        },
        {
          title: this.t("database.country"),
          align: "end",
          key: "country",
        },
        {
          title: this.t("database.university"),
          align: "end",
          key: "university",
        },
        {
          title: this.t("database.ETCSPoints"),
          align: "end",
          key: "ETCSPoints",
        },
        {
          title: this.t("database.comments"),
          align: "end",
          key: "comment",
        },
        {
          title: "",
          align: "end",
          key: "favorite",
        },
      ];
    },
    translatedMobileHeaders() {
      return [
        {
          align: "start",
          key: "country",
        },
        {
          title: this.t("database.university"),
          align: "start",
          key: "university",
        },
        {
          title: this.t("database.study"),
          align: "end",
          key: "study",
        },
      ];
    },
    translatedMobileHeadersCourses() {
      return [
        {
          title: this.t("database.courseName"),
          align: "start",
          key: "courseName",
        },
        {
          title: this.t("database.courseCode"),
          align: "end",
          key: "courseCode",
        },
        {
          title: this.t("database.replacedCourseName"),
          align: "end",
          key: "replacedCourseName",
        },
        {
          title: this.t("database.replacedCourseCode"),
          align: "end",
          key: "replacedCourseCode",
        },
        {
          title: this.t("database.courseType"),
          align: "end",
          key: "courseType",
        },
        {
          title: this.t("database.institute"),
          align: "end",
          key: "institute",
        },
        {
          title: this.t("database.ETCSPoints"),
          align: "end",
          key: "ETCSPoints",
        },
        {
          title: this.t("database.comments"),
          align: "end",
          key: "comment",
        },
      ];
    },
  },
  methods: {
    updateScreenWidth() {
      this.screenWidth = window.innerWidth;
    },
    toggleFilters() {
      this.showFilters = !this.showFilters;
    },
    async getValuesFromDatabase() {
      try {
        const exchangesSnapshot = await get(child(dbRef(db), "exchanges"));
        if (exchangesSnapshot.exists()) {
          let exchanges = exchangesSnapshot.val();
          const countriesSet = new Set();
          const universitiesSet = new Set();
          const studiesSet = new Set();
          const specializationsSet = new Set();

          for (const exchangeKey in exchanges) {
            const exchange = exchanges[exchangeKey];

            // Check if either 'Høst' or 'Vår' courses exist and have at least one course
            const hasAutumnCourses =
              exchange.courses &&
              exchange.courses.Høst &&
              exchange.courses.Høst.length > 0;
            const hasSpringCourses =
              exchange.courses &&
              exchange.courses.Vår &&
              exchange.courses.Vår.length > 0;

            if (hasAutumnCourses || hasSpringCourses) {
              if (exchange.country) {
                countriesSet.add(this.$t(`countries.${exchange.country}`));
              }
              if (exchange.university) {
                universitiesSet.add(exchange.university);
              }
              if (exchange.study) {
                studiesSet.add(exchange.study);
              }
              if (exchange.specialization) {
                specializationsSet.add(exchange.specialization);
              }
            }
          }

          this.countryList = Array.from(countriesSet);
          this.universityList = Array.from(universitiesSet);
          this.studyList = Array.from(studiesSet);
          this.specializationList = Array.from(specializationsSet);
        } else {
          console.error("No data available");
        }
      } catch (error) {
        console.error("Error fetching values from database:", error);
      }
    },
    remove(item) {
      this.countryValues = this.countryValues.filter((i) => i !== item);
    },
    async fetchExchangeData() {
      try {
        const snapshot = await get(child(dbRef(db), "exchanges"));
        if (!snapshot.exists()) {
          console.error("No data available");
          return;
        }

        const exchanges = snapshot.val();

        // Temporary dictionary for grouping
        const grouped = {};

        const toArray = (obj) =>
          Array.isArray(obj) ? obj : Object.values(obj || {});

        for (const exchangeKey in exchanges) {
          const exchange = exchanges[exchangeKey];
          if (!exchange.courses) continue;

          // Convert Høst and Vår to arrays
          const host = toArray(exchange.courses.Høst);
          const vaar = toArray(exchange.courses.Vår);

          const allCourses = [...host, ...vaar];

          for (const course of allCourses) {
            if (!course.replacedCourseCode) continue;

            const code = course.replacedCourseCode;
            const name = course.replacedCourseName || "Unknown";

            if (!grouped[code]) {
              grouped[code] = {
                id: code,
                courseCode: code,
                courseName: name,
                courses: [],
              };
            }

            grouped[code].courses.push(course);
          }
        }

        // Convert dict → array (Vuetify requires array)
        this.courseList = Object.values(grouped);
        console.log("Final course list:", this.courseList);

      } catch (error) {
        console.error("Error fetching exchange data:", error);
      }
    },
    applyFilters(exchanges) {
      if (this.countryValues.length > 0) {
        exchanges = exchanges.filter((exchange) =>
          this.countryValues.includes(exchange.country)
        );
      }
      if (this.universityValues.length > 0) {
        exchanges = exchanges.filter((exchange) =>
          this.universityValues.includes(exchange.university)
        );
      }
      if (this.studyValues.length > 0) {
        exchanges = exchanges.filter((exchange) =>
          this.studyValues.includes(exchange.study)
        );
      }
      if (this.specializationValues.length > 0) {
        exchanges = exchanges.filter((exchange) =>
          this.specializationValues.includes(exchange.specialization)
        );
      }
      if (this.numSemestersValues.length > 0) {
        exchanges = exchanges.filter((exchange) =>
          this.numSemestersValues.includes(exchange.numSemesters)
        );
      }
      return exchanges;
    },
    reformatExchanges(exchanges) {
      return exchanges.reduce((result, exchange) => {
        if (!exchange.sameUniversity && exchange.courses.Vår) {
          const firstExchange = this.createExchange(exchange, {
            Høst: exchange.courses.Høst,
            Vår: [],
          });

          const newExchange = this.createExchange(
            {
              ...exchange,
              id: exchange.id + "new",
              university: exchange.secondUniversity,
              country: exchange.secondCountry,
            },
            {
              Høst: [],
              Vår: exchange.courses.Vår,
            }
          );
          result.push(firstExchange);
          result.push(newExchange);
        } else {
          if (!!exchange.courses.Høst !== !!exchange.courses.Vår) {
            exchange.numSemesters = 1;
          }
          result.push(exchange);
        }
        return result;
      }, []);
    },
    createExchange(baseExchange, courses) {
      return {
        ...baseExchange,
        courses: courses,
        numSemesters: 1,
      };
    },
    showComments(course) {
      this.currentCourseName = course.courseName;
      this.currentComments =
        course.comments || this.t("exchanges.noComments");
      this.commentDialog = true;
    },
    closeCommentDialog() {
      this.commentDialog = false;
    },
    toggleInformationDialog(course) {
      this.informationDialog = !this.informationDialog;
      if (this.informationDialog) {
        this.currentCourse = course;
      }
    },
    closeInformationDialog() {
      this.informationDialog = false;
    },
    getFlagUrl(country) {
      const flagBaseUrl = "https://flagcdn.com/128x96/";
      const countryCode = this.getCountryCode(country).toLowerCase();
      return `${flagBaseUrl}${countryCode}.png`;
    },
    getCountryCode(country) {
      if (this.locale === "en") {
        return this.countriesInfo.countryCodes.en[country] || "unknown";
      } else {
        return this.countriesInfo.countryCodes.no[country] || "unknown";
      }
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

      // Get country and university and add to course object
      const exchange = this.courseList.find(exchange =>
        (exchange.courses.Høst && exchange.courses.Høst.includes(course)) ||
        (exchange.courses.Vår && exchange.courses.Vår.includes(course))
      );

      if (exchange) {
        course.country = exchange.country;
        course.university = exchange.university;
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

<style>
.v-data-table table tr th,
.v-data-table table tr td {
  padding: 0 8px !important;
}
</style>
