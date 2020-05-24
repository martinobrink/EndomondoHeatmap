import gpxpy
import click
import os
from configparser import SafeConfigParser
import sys

parser = SafeConfigParser()
parser.read('credentials.cfg')
API_KEY = parser.get('Google', 'API_KEY')

@click.command()
@click.option("--output", default="map", help="Specify the name of the output file. Defaults to `map`")
@click.option("--input", default="gpx", help="Specify an input folder. Defaults to `gpx`")
@click.option("--filter", default=None, help="Specify a filter type. Defaults to no filter", type=click.Choice(['running', 'cycling', 'walking']))
def main(output, input, filter):
    workoutdata = load_workoutdata(input, filter)
    generate_html(workoutdata, output)

def load_workoutdata(folder, filter):
    """Loads all gpx files into a dictionary of years and coordinates"""

    year_coord_dictionary = {}
    print (f"Loading files with type {filter}...") #Loads files with progressbar
    with click.progressbar(os.listdir(folder)) as bar:
        for filename in bar:
            if (filename.endswith(".gpx")):                
                gpx_file = open(f'{folder}/' + filename)
                gpx = gpxpy.parse(gpx_file)
                for track in gpx.tracks:
                    if not filter or filter==track.type:
                        for segment in track.segments:
                            for point in segment.points:                                
                                if point.time.year in year_coord_dictionary:
                                    year_coord_dictionary[point.time.year].append([float(point.latitude), float(point.longitude)])
                                else:
                                    year_coord_dictionary[point.time.year] = [[float(point.latitude), float(point.longitude)]]

    return (year_coord_dictionary)

def generate_html(workoutdata_dict, file_out):
    """Generates a new html file with workout data"""
    if not os.path.exists('output'):
        os.makedirs('output')
    f = open(f"output/{file_out}.html", "w")
    template = get_template()
    workoutdata_text = serialize_workoutdata(workoutdata_dict)
    updated_content = template.replace("<WORKOUT_YEAR_COORDINATE_DICTIONARY>", workoutdata_text).replace("<API_KEY>", API_KEY)
    f.write(updated_content)
    f.close()

def get_template():
    """Reads in the html template file"""
    with open('map-template.txt', 'r') as file:
        template = file.read()
    return template

def serialize_workoutdata(workoutdata_dict):
    serialized_data = "{\n"
    for key in workoutdata_dict.keys():
        serialized_data += " " + str(key) + " : [\n"
        for value in workoutdata_dict[key]:
            serialized_data += "  new google.maps.LatLng(" + str(value[0]) + "," + str(value[1]) + "),\n"
        serialized_data += "],\n"
    serialized_data += "};"

    return serialized_data

if __name__ == '__main__':
    main()
