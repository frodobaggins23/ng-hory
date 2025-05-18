
SOURCE_FILES_DIR='./tracks-tmp'

TRACKS_ROOT_DIR='./src/data/tracks'
BLANIK_DIR="${TRACKS_ROOT_DIR}/blanik"
JESTED_DIR="${TRACKS_ROOT_DIR}/jested"
LOVOS_DIR="${TRACKS_ROOT_DIR}/lovos"
RIP_DIR="${TRACKS_ROOT_DIR}/rip"
SNEZKA_DIR="${TRACKS_ROOT_DIR}/snezka"
RALSKO_DIR="${TRACKS_ROOT_DIR}/ralsko"
MILESOVKA_DIR="${TRACKS_ROOT_DIR}/milesovka"

MOUNTAINS=(
    "BLANIK"
    "JESTED"
    "LOVOS"
    "RIP"
    "SNEZKA"
    "RALSKO"
    "MILESOVKA"
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

        