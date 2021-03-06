# Endomondo Workout Heatmap

This repo contains easily modifiable code to download your workouts from Endomondo and subsequently generate an interactive Google Maps heatmap. The code is heavily inspired by examples and code from [endomondo-api-handler](https://github.com/fabulator/endomondo-api-handler) and [GPXtoHeatmap](https://github.com/TomCasavant/GPXtoHeatmap).

## Usage

**Install Dependencies**

```bash
// install node dependencies for retrival of Endomondo workouts
$ npm install

// Install python dependencies for generating heatmap from workouts
$ python3 -m pip install -r requirements.txt
```

**Add credentials to credentials.cfg file**

Copy contents of 'credentials-example.cfg' into a new file 'credentials.cfg' and replace the segments containing Endomondo and Google credentials. This file ('credentials.cfg') has _deliberately_ been added to the .gitignore file so you do NOT add this file to this repo by mistake. 

## Downloading Endomondo workouts

```bash
node download-endomondo-workouts.js 
```

## Generating heatmap from workout/gpx-files

```bash
$ python3 heatmap.py --input workoutdata --output map
```

This should generate an html file ('output/map.html'), which displays a Google Maps page with a heatmap overlay from the workout data in your .gpx files. You can cycle through each year of workout data using the 'Toggle year' button in the foating panel at the top. To display all years of data in a single overlay use the 'Display all data' button.

## More info

For more info and getting data from other suppliers (e.g. Strava/Garmin), please look at [GPXtoHeatmap](https://github.com/TomCasavant/GPXtoHeatmap).