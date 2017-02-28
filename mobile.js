function runIt() {
    loadRawData = function() {
        var a = Store.get("showPokemon")
          , b = Store.get("showGyms")
          , c = Store.get("showPokestops")
          , d = Store.get("showScanned")
          , e = Store.get("showSpawnpoints")
          , f = Boolean(Store.get("showLuredPokestopsOnly"))
          , g = map.getBounds()
          , h = g.getSouthWest()
          , i = g.getNorthEast()
          , j = h.lat()
          , k = h.lng()
          , l = i.lat()
          , m = i.lng();
        var excludedPokemon = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,
            21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,
            46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,69,70,71,
            72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,90,91,92,93,94,95,97,98,99,
            100,101,102,103,104,105,108,111,112,113,114,115,116,117,118,119,120,121,122,
            123,124,125,126,127,128,129,130,132,133,134,135,136,138,139,140,141,144,145,146,
            152,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,
            173,174,175,177,178,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,
            195,196,197,198,199,200,202,203,204,205,206,207,208,209,210,211,212,213,214,216,
            217,218,219,221,222,224,225,228,229,230,232,233,234,235,236,238,239,240,241,243,
            244,245,249,250,251,252,253,254,445];
        return $.ajax({
            url: "raw_data",
            type: "GET",
            data: {
                timestamp: timestamp,
                pokemon: a,
                lastpokemon: lastpokemon,
                pokestops: c,
                lastpokestops: lastpokestops,
                luredonly: f,
                gyms: b,
                lastgyms: lastgyms,
                scanned: d,
                lastslocs: lastslocs,
                spawnpoints: e,
                lastspawns: lastspawns,
                swLat: j,
                swLng: k,
                neLat: l,
                neLng: m,
                oSwLat: oSwLat,
                oSwLng: oSwLng,
                oNeLat: oNeLat,
                oNeLng: oNeLng,
                reids: String(reincludedPokemon),
                eids: String(excludedPokemon)
            },
            dataType: "json",
            cache: !1,
            beforeSend: function a() {
                return !rawDataIsLoading && void (rawDataIsLoading = !0)
            },
            error: function a() {
                if ($timeoutDialog)
                    $timeoutDialog.dialog("isOpen") || $timeoutDialog.dialog("open");
                else {
                    var b = {
                        title: "Reduce marker settings"
                    };
                    $timeoutDialog = $("<div>Hmm... we're having problems getting data for your criteria. Try reducing what you're showing and zooming in to limit what's returned.</div>").dialog(b),
                    $timeoutDialog.dialog("open")
                }
            },
            complete: function a() {
                rawDataIsLoading = !1
            }
        })
    }

    processPokemons = function(a, b) {
        var sum = (b.individual_attack || 0) + (b.individual_defense || 0) + (b.individual_stamina || 0);
        var perc = sum/45*100;
        if (b.pokemon_id == 107 && sum < 60) return;
        if (b.pokemon_id == 106 && sum < 65) return;
        if (b.pokemon_id == 227 && sum < 68) return;
        return !!Store.get("showPokemon") && void (!(b.encounter_id in mapData.pokemons) && excludedPokemon.indexOf(b.pokemon_id) < 0 && b.disappear_time > Date.now() && (b.marker && b.marker.setMap(null),
        b.hidden || (b.marker = setupPokemonMarker(b, map),
        customizePokemonMarker(b.marker, b),
        mapData.pokemons[b.encounter_id] = b)))
    }

    $.each(mapData.pokemons, function(a, b) {
        delete mapData.pokemons[a].marker.rangeCircle;
        mapData.pokemons[a].marker.setMap(null);
        delete mapData.pokemons[a];
    })

    lastpokemon = null;
}

setTimeout(runIt, 5000);
