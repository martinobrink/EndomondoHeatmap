require('cross-fetch/polyfill');
const fs = require('fs');
const { Api } = require('endomondo-api-handler');
const ConfigParser = require('configparser');

const config = new ConfigParser();
const api = new Api();

config.read('credentials.cfg');
var email = config.get('Endomondo', 'EMAIL');
var password = config.get('Endomondo', 'PASSWORD');

var workoutdir = "workoutdata";
if (!fs.existsSync(workoutdir)){
    fs.mkdirSync(workoutdir);
}
 
(async () => {
    await api.login(email, password); 
    await api.processWorkouts({}, 
        async (workout) => {
            console.log(workout.toString());
            if (workout.hasGPSData()) {
                fs.writeFileSync(`${workoutdir}/${workout.getStart().toISODate()}-${workout.getId()}.gpx`, await api.getWorkoutGpx(workout.getId()), 'utf8');
            }
    });
})();
 