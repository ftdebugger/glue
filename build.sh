#!/bin/bash

BUILD="./build"

function outTo() {
	cat $1 >> $2
	echo "
	" >> $2
}

function uglify() {
    uglifyjs $1 >> $2
}

function buildCore() {
    OUT="${BUILD}/glue.js"

	outTo "src/resources/_header.js" ${OUT}
	outTo "src/glue.js" ${OUT}
	outTo "src/Instance.js" ${OUT}
	outTo "src/Nexus.js" ${OUT}
	outTo "src/Listener.js" ${OUT}
	outTo "src/Observer.js" ${OUT}
	outTo "src/resources/_footer.js" ${OUT}

	uglify  ${OUT} "${BUILD}/glue.min.js"
}

function buildWidget() {
    PLUGIN="${BUILD}/glue.plugin.widget.js"

	outTo "src/plugins/widget/resources/_header.js" ${PLUGIN}
    outTo "src/plugins/widget/List.js" ${PLUGIN}
    outTo "src/plugins/widget/Dict.js" ${PLUGIN}
    outTo "src/plugins/widget/Widget.js" ${PLUGIN}
	outTo "src/plugins/widget/resources/_footer.js" ${PLUGIN}

	uglify  ${PLUGIN} "${BUILD}/glue.plugin.widget.min.js"
}

function buildModel() {
    PLUGIN="${BUILD}/glue.plugin.model.js"

	outTo "src/plugins/model/resources/_header.js" ${PLUGIN}
    outTo "src/plugins/model/Model.js" ${PLUGIN}
	outTo "src/plugins/model/resources/_footer.js" ${PLUGIN}

	uglify  ${PLUGIN} "${BUILD}/glue.plugin.model.min.js"
}

function clean() {
	rm -f build/*
}

function build() {
    clean
    buildCore
    buildWidget
    buildModel
}

build