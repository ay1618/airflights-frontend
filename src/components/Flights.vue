<template>
	<b-container fluid class="my-1">
		<!-- User Interface controls -->
		<b-row class="mb-3 mt-3">
			<b-col lg="6" class="my-1">
				<b-form-group
					label="From"
					label-cols-sm="3"
					label-align-sm="right"
					label-size="sm"
					label-for="sortBySelect"
					class="mb-0"
				>
					<b-input-group size="sm">
						<b-form-select
							v-model="fromCity"
							id="sortBySelect"
							:options="cities"
							class="w-75"
							value-field="id"
							text-field="name"
						>
						</b-form-select>
					</b-input-group>
				</b-form-group>
			</b-col>

			<b-col lg="6" class="my-1">
				<b-form-group
					label="to"
					label-cols-sm="3"
					label-align-sm="right"
					label-size="sm"
					label-for="initialSortSelect"
					class="mb-0"
				>
					<b-form-select
						v-model="toCity"
						id="initialSortSelect"
						size="sm"
						:options="cities"
						value-field="id"
						text-field="name"
					></b-form-select>
				</b-form-group>
			</b-col>

			<!-- <b-col lg="6" class="my-1">
				<b-form-group
					label="Filter"
					label-cols-sm="3"
					label-align-sm="right"
					label-size="sm"
					label-for="filterInput"
					class="mb-0"
				>
					<b-input-group size="sm">
						<b-form-input
							v-model="filter"
							type="search"
							id="filterInput"
							placeholder="Type to Search"
						></b-form-input>
						<b-input-group-append>
							<b-button :disabled="!filter" @click="filter = ''"
								>Clear</b-button
							>
						</b-input-group-append>
					</b-input-group>
				</b-form-group>
			</b-col> -->

			<b-col lg="6" class="mt-5 my-1">
				<b-form-group
					label="Departure date"
					label-cols-sm="3"
					label-align-sm="right"
					label-size="sm"
					label-for="filterInput"
					class="mt-0"
				>
					<b-form-datepicker
						id="example-datepicker"
						v-model="departureDate"
						class="mb-2"
					></b-form-datepicker>
				</b-form-group>
			</b-col>

			<b-col lg="6" class="mt-5 my-1">
				<b-form-group
					label="Departure time"
					label-cols-sm="3"
					label-align-sm="right"
					label-size="sm"
					label-for="filterInput"
					class="mt-0"
				>
					<vue-range-slider
						class="mt-1"
						v-model="rangeDeprtureValue"
						:min="min"
						:max="max"
						:step="step"
						:enable-cross="enableCross"
						:tooltip-merge="true"
						:merge-formatter="mergeFormatString"
						:formatter="getTimeString"
					>
					</vue-range-slider>
				</b-form-group>
			</b-col>
			<!-- <b-col lg="6" class="mt-5 my-1 ml-n4">
				<b-form-group
					label="Arrival time"
					label-cols-sm="3"
					label-align-sm="right"
					label-size="sm"
					label-for="filterInput"
					class="mt-0"
				>
					<vue-range-slider
						v-model="rangeArrivalValue"
						:min="min"
						:max="max"
						:step="step"
						:enable-cross="enableCross"
						:tooltip-merge="true"
						:merge-formatter="mergeFormatString"
						:formatter="getTimeString"
					>
					</vue-range-slider>
				</b-form-group>
			</b-col> -->
		</b-row>

		<!-- Main table element -->
		<b-table
			show-empty
			small
			stacked="md"
			:items="flights"
			:fields="fields"
			:current-page="currentPage"
			:per-page="perPage"
			:filter="filter"
			:filter-included-fields="filterOn"
			:sort-by.sync="sortBy"
			:sort-desc.sync="sortDesc"
			:sort-direction="sortDirection"
			@filtered="onFiltered"
		>
			<!-- <template #cell(name)="row">
				{{ row.value.first }} {{ row.value.last }}
			</template> -->

			<template #cell(actions)="row">
				<b-button
					size="sm"
					@click="info(row.item, row.index, $event.target)"
					class="mr-1"
				>
					Info modal
				</b-button>
				<b-button size="sm" @click="row.toggleDetails">
					{{ row.detailsShowing ? "Hide" : "Show" }} Details
				</b-button>
			</template>

			<template #row-details="row">
				<b-card>
					<ul>
						<li v-for="(value, key) in row.item" :key="key">
							{{ key }}: {{ value }}
						</li>
					</ul>
				</b-card>
			</template>
		</b-table>

		<b-row align-h="end">
			<b-col sm="5" md="3">
				<b-form-group
					label="Per page"
					label-cols-sm="5"
					label-cols-md="4"
					label-cols-lg="3"
					label-align-sm="right"
					label-size="sm"
					label-for="perPageSelect"
					class="mb-0"
				>
					<b-form-select
						v-model="perPage"
						id="perPageSelect"
						size="sm"
						:options="pageOptions"
						style="width: 90px"
					></b-form-select>
				</b-form-group>
			</b-col>
			<b-col cols="4">
				<b-pagination
					v-model="currentPage"
					:total-rows="totalRows"
					:per-page="perPage"
					align="fill"
					size="sm"
					class="my-0"
				></b-pagination>
			</b-col>
		</b-row>

		<!-- Info modal -->
		<b-modal
			:id="infoModal.id"
			:title="infoModal.title"
			ok-only
			@hide="resetInfoModal"
		>
			<pre>{{ infoModal.content }}</pre>
		</b-modal>
	</b-container>
</template>

<script>
import "vue-range-component/dist/vue-range-slider.css";
import VueRangeSlider from "vue-range-component";

export default {
	components: {
		VueRangeSlider,
	},
	data() {
		return {
			fields: [
				{
					key: "id",
					label: "ID",
					sortable: true,
					sortDirection: "desc",
				},
				{
					key: "fromCity.name",
					label: "From",
					sortable: true,
					sortDirection: "desc",
				},
				{
					key: "toCity.name",
					label: "To",
					sortable: true,
					sortDirection: "desc",
				},
				{
					key: "departureTime",
					label: "Departure time",
					sortable: true,
					formatter: (value /*, key, item */) => {
						return new Date(value).toLocaleString();
					},
					class: "text-center",
					sortDirection: "desc",
				},
				{
					key: "arrivalTime",
					label: "Arrival time",
					sortable: true,
					formatter: (value /*, key, item */) => {
						return new Date(value).toLocaleString();
					},
					class: "text-center",
					sortDirection: "desc",
				},
				{
					key: "delay",
					label: "Delay time",
					sortable: true,
					class: "text-center",
					sortDirection: "desc",
				},

				{ key: "actions", label: "Actions" },
			],
			totalRows: 1,
			currentPage: 1,
			perPage: 5,
			pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }],
			sortBy: "",
			sortDesc: false,
			sortDirection: "asc",
			filter: null,
			filterOn: [],
			infoModal: {
				id: "info-modal",
				title: "",
				content: "",
			},

			//------
			cities: [],
			fromCity: null,
			toCity: null,
			flights: [],

			rangeDeprtureValue: [0, 24 * 60],
			rangeArrivalValue: [0, 24 * 60],
			min: 0,
			max: 24 * 60,
			step: 15,
			enableCross: false,

			departureDate: null,
		};
	},
	computed: {
		sortOptions() {
			// Create an options list from our fields
			return this.fields
				.filter((f) => f.sortable)
				.map((f) => {
					return { text: f.label, value: f.key };
				});
		},
	},
	mounted() {
		// Set the initial number of items
		this.totalRows = this.flights.length;
	},
	methods: {
		info(item, index, button) {
			this.infoModal.title = `Row index: ${index}`;
			this.infoModal.content = JSON.stringify(item, null, 2);
			this.$root.$emit("bv::show::modal", this.infoModal.id, button);
		},
		resetInfoModal() {
			this.infoModal.title = "";
			this.infoModal.content = "";
		},
		onFiltered(filteredItems) {
			// Trigger pagination to update the number of buttons/pages due to filtering
			this.totalRows = filteredItems.length;
			this.currentPage = 1;
		},

		//---------
		async getCities() {
			try {
				let response = await this.$http.get(`/api/dict/cities`);
				this.cities = response.data.data;
			} catch (error) {
				window.console.error(error);
			}
		},
		async getFlights() {
			try {
				let response = await this.$http.get(`/api/flights`);
				this.flights = response.data.data;
			} catch (error) {
				window.console.error(error);
			}
		},
		getTimeString(value) {
			// return new Date(`0001-01-01T${value < 10 ? `0${value}` : value }:00:00`).toLocaleTimeString();

			let hours = parseInt(value / 60);
			let mins = value % 60;
			let hoursStrPart = hours < 10 ? `0${hours}` : hours;
			let minsStrPart = mins < 10 ? `0${mins}` : mins;
			return new Date(
				`0001-01-01T${hoursStrPart}:${minsStrPart}:00`
			).toLocaleTimeString();
		},
		mergeFormatString(value1, value2) {
			return `${this.getTimeString(value1)} - ${this.getTimeString(
				value2
			)}`;
		},
	},
	async created() {
		await this.getCities();
		await this.getFlights();
	},
};
</script>

<style>
</style>