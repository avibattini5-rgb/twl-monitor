/* =====================================================
   THERMOSAFE
   Thermal Work Limit Monitoring System
===================================================== */

"use strict";


/* =====================================================
   APPLICATION STATE
===================================================== */

const app = {

    location: null,

    data: null,

    connected: false,

    lastUpdate: null,

    history: []

};


/* =====================================================
   DOM HELPERS
===================================================== */

const $ = (id) => document.getElementById(id);

const elements = {

    clock: $("clock"),

    locationInput: $("locationInput"),

    locationSearchButton:
        $("locationSearchButton"),

    locationName:
        $("locationName"),

    locationDetails:
        $("locationDetails"),

    twlValue:
        $("twlValue"),

    twlStatus:
        $("twlStatus"),

    twlDescription:
        $("twlDescription"),

    twlLight:
        $("twlLight"),

    workStatus:
        $("workStatus"),

    workStatusCircle:
        $("workStatusCircle"),

    workDescription:
        $("workDescription"),

    airTemperature:
        $("airTemperature"),

    globeTemperature:
        $("globeTemperature"),

    wetBulbTemperature:
        $("wetBulbTemperature"),

    windSpeed:
        $("windSpeed"),

    humidity:
        $("humidity"),

    pressure:
        $("pressure"),

    sensorButton:
        $("sensorButton"),

    manualButton:
        $("manualButton")

};


/* =====================================================
   CLOCK
===================================================== */

function updateClock() {

    if (!elements.clock) return;

    elements.clock.textContent =
        new Date().toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }
        );

}

setInterval(updateClock, 1000);

updateClock();


/* =====================================================
   STATUS COLORS
===================================================== */

function setStatusColor(color) {

    if (elements.twlLight) {

        elements.twlLight.style.background =
            color;

        elements.twlLight.style.boxShadow =
            `0 0 14px ${color}`;

    }

    if (elements.workStatusCircle) {

        elements.workStatusCircle.style.color =
            color;

        elements.workStatusCircle.style.borderColor =
            `${color}55`;

        elements.workStatusCircle.style.background =
            `${color}10`;

    }

}


/* =====================================================
   RESET DASHBOARD
===================================================== */

function resetDashboard() {

    elements.twlValue.textContent = "--";

    elements.twlStatus.textContent =
        "AWAITING DATA";

    elements.twlDescription.textContent =
        "No validated TWL measurement is currently available.";

    elements.workStatus.textContent =
        "DATA REQUIRED";

    elements.workStatusCircle.textContent =
        "—";

    elements.workDescription.textContent =
        "Connect a validated TWL measurement source.";

    elements.airTemperature.textContent = "—";

    elements.globeTemperature.textContent = "—";

    elements.wetBulbTemperature.textContent = "—";

    elements.windSpeed.textContent = "—";

    elements.humidity.textContent = "—";

    elements.pressure.textContent = "—";

    setStatusColor("#ffd166");

}


/* =====================================================
   DISPLAY ENVIRONMENTAL DATA
===================================================== */

function displayEnvironmentalData(data) {

    if (!data) return;


    if (data.airTemperature !== undefined) {

        elements.airTemperature.textContent =
            `${data.airTemperature.toFixed(1)}`;

    }


    if (data.globeTemperature !== undefined) {

        elements.globeTemperature.textContent =
            `${data.globeTemperature.toFixed(1)}`;

    }


    if (data.wetBulbTemperature !== undefined) {

        elements.wetBulbTemperature.textContent =
            `${data.wetBulbTemperature.toFixed(1)}`;

    }


    if (data.windSpeed !== undefined) {

        elements.windSpeed.textContent =
            `${data.windSpeed.toFixed(2)}`;

    }


    if (data.relativeHumidity !== undefined) {

        elements.humidity.textContent =
            `${data.relativeHumidity.toFixed(1)}`;

    }


    if (data.pressure !== undefined) {

        elements.pressure.textContent =
            `${data.pressure.toFixed(1)}`;

    }

}


/* =====================================================
   LOCATION SEARCH
===================================================== */

async function searchLocation() {

    const query =
        elements.locationInput.value.trim();


    if (!query) {

        alert(
            "Please enter a location."
        );

        return;

    }


    elements.locationSearchButton.textContent =
        "SEARCHING...";


    try {

        /*
         * Location search will be connected to
         * the validated TWL data source later.
         *
         * We intentionally do not substitute
         * ordinary weather data for TWL sensor
         * measurements.
         */

        elements.locationName.textContent =
            query;

        elements.locationDetails.textContent =
            "Location selected. Awaiting validated TWL sensor data.";

        app.location = query;


        resetDashboard();

    }

    catch (error) {

        console.error(
            "Location error:",
            error
        );

        elements.locationDetails.textContent =
            "Unable to process this location.";

    }

    finally {

        elements.locationSearchButton.textContent =
            "SEARCH";

    }

}


/* =====================================================
   SEARCH EVENTS
===================================================== */

elements.locationSearchButton
    .addEventListener(
        "click",
        searchLocation
    );


elements.locationInput
    .addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Enter") {

                searchLocation();

            }

        }
    );


/* =====================================================
   SENSOR CONNECTION
===================================================== */

function connectSensor() {

    /*
     * A browser cannot connect to an unknown
     * physical industrial sensor automatically.
     *
     * This button will later initiate the real
     * sensor/API connection.
     */

    alert(
        "No TWL sensor gateway is configured yet.\n\n" +
        "Connect an approved TWL measurement system " +
        "or configure its API/gateway before using live data."
    );

}


/* =====================================================
   MANUAL INPUT
===================================================== */

function openManualInput() {

    const air =
        prompt(
            "Enter validated air temperature (°C):"
        );

    if (air === null) return;


    const globe =
        prompt(
            "Enter validated globe temperature (°C):"
        );

    if (globe === null) return;


    const wetBulb =
        prompt(
            "Enter validated wet-bulb temperature (°C):"
        );

    if (wetBulb === null) return;


    const wind =
        prompt(
            "Enter validated wind speed (m/s):"
        );

    if (wind === null) return;


    const humidity =
        prompt(
            "Enter relative humidity (%):"
        );

    if (humidity === null) return;


    const pressure =
        prompt(
            "Enter atmospheric pressure (kPa):"
        );

    if (pressure === null) return;


    const values = {

        airTemperature:
            Number(air),

        globeTemperature:
            Number(globe),

        wetBulbTemperature:
            Number(wetBulb),

        windSpeed:
            Number(wind),

        relativeHumidity:
            Number(humidity),

        pressure:
            Number(pressure)

    };


    const valid =
        Object.values(values)
            .every(
                value =>
                    Number.isFinite(value)
            );


    if (!valid) {

        alert(
            "Please enter valid numeric measurements."
        );

        return;

    }


    app.data = values;

    app.lastUpdate = new Date();

    app.connected = true;


    displayEnvironmentalData(values);


    /*
     * IMPORTANT:
     *
     * We intentionally do NOT calculate a TWL
     * using an unverified formula.
     *
     * The validated TWL calculation engine will
     * be added once its measurement requirements
     * and standard are established.
     */

    elements.twlStatus.textContent =
        "INPUTS READY";

    elements.twlDescription.textContent =
        "Environmental measurements received. TWL calculation engine pending validation.";

    elements.workStatus.textContent =
        "AWAITING TWL";

    elements.workStatusCircle.textContent =
        "…";

    elements.workDescription.textContent =
        "Measurements are available for TWL assessment.";

    setStatusColor("#38d8ff");

}


/* =====================================================
   BUTTON EVENTS
===================================================== */

elements.sensorButton
    .addEventListener(
        "click",
        connectSensor
    );


elements.manualButton
    .addEventListener(
        "click",
        openManualInput
    );


/* =====================================================
   INITIALIZE
===================================================== */

function initialize() {

    resetDashboard();

    console.log(
        "THERMOSAFE initialized."
    );

    console.log(
        "No simulated sensor data is being used."
    );

}

initialize();
