
SOURCE_FILES_DIR='./.tracks-tmp'

TRACKS_ROOT_DIR='./public/assets/tracks'
BLANIK_DIR="${TRACKS_ROOT_DIR}/blanik"
BABKA_DIR="${TRACKS_ROOT_DIR}/babka"
JESTED_DIR="${TRACKS_ROOT_DIR}/jested"
LOVOS_DIR="${TRACKS_ROOT_DIR}/lovos"
RALSKO_DIR="${TRACKS_ROOT_DIR}/ralsko"
MILESOVKA_DIR="${TRACKS_ROOT_DIR}/milesovka"
KOSTALOV_DIR="${TRACKS_ROOT_DIR}/kostalov"
LIPSKA_HORA_DIR="${TRACKS_ROOT_DIR}/lipska_hora"
RIP_DIR="${TRACKS_ROOT_DIR}/rip"

MOUNTAINS=(
    "BLANIK"
    "BABKA"
    "JESTED"
    "LOVOS"
    "RALSKO"
    "MILESOVKA"
    "KOSTALOV"
    "LIPSKA_HORA"
    "RIP"
)

if [ ! -d "./tracks" ]; then
    mkdir -p ./tracks
fi

get_dest_folder () {
    for mountain in "${MOUNTAINS[@]}"; do
        if [[ "$(basename "$1" | tr '[:lower:]' '[:upper:]')" == *"$mountain"* ]]; then
           eval echo "\$${mountain}_DIR"
           return 0
        fi
    done
}

find "$SOURCE_FILES_DIR" -type f -name "*.gpx" | while read -r file; do
    echo "Processing $file"
    DEST=$(get_dest_folder "$file")
    echo "Destination: $DEST"
    CMD="ogr2ogr -f GeoJSON \"$DEST/$(basename "$file" .gpx).json\" \"$file\" tracks"
    echo "$CMD"
    eval $CMD
    npx prettier --write "$DEST/*.json"
done

        