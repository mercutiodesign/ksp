// Generated by CoffeeScript 1.9.2
(function() {
  var MissionForm, prepareOrigins;

  (typeof exports !== "undefined" && exports !== null ? exports : this).prepareOrigins = prepareOrigins = function() {
    var addPlanetGroup, bodies, body, i, len, listBody, name, originGroup, originSelect, referenceBodyGroup, referenceBodySelect;
    originSelect = $('#originSelect');
    referenceBodySelect = $('#referenceBodySelect');
    originSelect.empty();
    referenceBodySelect.empty();
    $('<option>').text('Kerbol').appendTo(referenceBodySelect);
    listBody = function(referenceBody, originGroup, referenceBodyGroup) {
      var body, children, i, len, name, results;
      children = Object.keys(referenceBody.children());
      children.sort(function(a, b) {
        return CelestialBody[a].orbit.semiMajorAxis - CelestialBody[b].orbit.semiMajorAxis;
      });
      results = [];
      for (i = 0, len = children.length; i < len; i++) {
        name = children[i];
        body = CelestialBody[name];
        originGroup.append($('<option>').text(name));
        if (body.mass != null) {
          referenceBodyGroup.append($('<option>').text(name));
          results.push(listBody(body, originGroup, referenceBodyGroup));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };
    addPlanetGroup = function(planet, group, selectBox, minChildren) {
      if (group.children().size() >= minChildren) {
        return group.attr('label', planet + ' System').prepend($('<option>').text(planet)).appendTo(selectBox);
      } else {
        return $('<option>').text(planet).appendTo(selectBox);
      }
    };
    bodies = Object.keys(CelestialBody.Kerbol.children());
    bodies.sort(function(a, b) {
      return CelestialBody[a].orbit.semiMajorAxis - CelestialBody[b].orbit.semiMajorAxis;
    });
    for (i = 0, len = bodies.length; i < len; i++) {
      name = bodies[i];
      body = CelestialBody[name];
      if (body.mass == null) {
        $('<option>').text(name).appendTo(originSelect);
      } else {
        originGroup = $('<optgroup>');
        referenceBodyGroup = $('<optgroup>');
        listBody(body, originGroup, referenceBodyGroup);
        addPlanetGroup(name, originGroup, originSelect, 2);
        addPlanetGroup(name, referenceBodyGroup, referenceBodySelect, 1);
      }
    }
    originSelect.val('Kerbin');
    if (originSelect.val() == null) {
      return originSelect.prop('selectedIndex', 0);
    }
  };

  MissionForm = (function() {
    var updateAdvancedControls;

    function MissionForm(form, celestialBodyForm) {
      this.form = form;
      this.celestialBodyForm = celestialBodyForm;
      prepareOrigins();
      $('.altitude').tooltip({
        container: 'body'
      });
      $('#earthTime').click(((function(_this) {
        return function() {
          KerbalTime.setDateFormat(24, 365);
          return updateAdvancedControls.call(_this);
        };
      })(this)));
      $('#kerbinTime').click(((function(_this) {
        return function() {
          KerbalTime.setDateFormat(6, 426);
          return updateAdvancedControls.call(_this);
        };
      })(this)));
      if ($('#earthTime').prop('checked')) {
        $('#earthTime').click();
      }
      $('#originSelect').change((function(_this) {
        return function(event) {
          return _this.setOrigin($(event.target).val());
        };
      })(this));
      $('#destinationSelect').change((function(_this) {
        return function(event) {
          return _this.setDestination($(event.target).val());
        };
      })(this));
      this.setOrigin('Kerbin');
      this.setDestination('Duna');
      $('#originAddBtn').click((function(_this) {
        return function(event) {
          return _this.celestialBodyForm.add();
        };
      })(this));
      $('#originEditBtn').click((function(_this) {
        return function(event) {
          return _this.celestialBodyForm.edit(_this.origin());
        };
      })(this));
      $('#destinationAddBtn').click((function(_this) {
        return function(event) {
          var referenceBody;
          referenceBody = _this.origin().orbit.referenceBody;
          return _this.celestialBodyForm.add(referenceBody);
        };
      })(this));
      $('#destinationEditBtn').click((function(_this) {
        return function(event) {
          return _this.celestialBodyForm.edit(_this.destination(), true);
        };
      })(this));
      $('#noInsertionBurnCheckbox').change((function(_this) {
        return function(event) {
          if (_this.destination().mass != null) {
            return $('#finalOrbit').attr("disabled", $(event.target).is(":checked"));
          }
        };
      })(this));
      $('#showAdvancedControls').click((function(_this) {
        return function(event) {
          return _this.showAdvancedControls(!_this.advancedControlsVisible());
        };
      })(this));
      $('#earliestDepartureYear,#earliestDepartureDay').change((function(_this) {
        return function(event) {
          return _this.adjustLatestDeparture();
        };
      })(this));
      $('#shortestTimeOfFlight,#longestTimeOfFlight').change(function(event) {
        return setTimeOfFlight(+$('#shortestTimeOfFlight').val(), +$('#longestTimeOfFlight').val(), event.target.id === 'shortestTimeOfFlight');
      });
      this.form.bind('reset', (function(_this) {
        return function(event) {
          return setTimeout((function() {
            setOrigin('Kerbin');
            return setDestination('Duna');
          }), 0);
        };
      })(this));
      this.form.submit(((function(_this) {
        return function(event) {
          event.preventDefault();
          return $(_this).trigger('submit');
        };
      })(this)));
    }

    MissionForm.prototype.origin = function() {
      return CelestialBody[$('#originSelect').val()];
    };

    MissionForm.prototype.destination = function() {
      return CelestialBody[$('#destinationSelect').val()];
    };

    MissionForm.prototype.setOrigin = function(newOriginName) {
      var bodies, i, len, name, origin, previousDestination, referenceBody, s;
      $('#originSelect').val(newOriginName);
      origin = CelestialBody[newOriginName];
      referenceBody = origin.orbit.referenceBody;
      $('#initialOrbit').attr("disabled", origin.mass == null);
      s = $('#destinationSelect');
      previousDestination = s.val();
      s.empty();
      bodies = Object.keys(referenceBody.children());
      bodies.sort(function(a, b) {
        return CelestialBody[a].orbit.semiMajorAxis - CelestialBody[b].orbit.semiMajorAxis;
      });
      for (i = 0, len = bodies.length; i < len; i++) {
        name = bodies[i];
        if (CelestialBody[name] !== origin) {
          s.append($('<option>').text(name));
        }
      }
      s.val(previousDestination);
      if (s.val() == null) {
        s.prop('selectedIndex', 0);
      }
      s.prop('disabled', s[0].childNodes.length === 0);
      return updateAdvancedControls.call(this);
    };

    MissionForm.prototype.setDestination = function(newDestinationName) {
      $('#destinationSelect').val(newDestinationName);
      $('#finalOrbit').attr("disabled", CelestialBody[newDestinationName].mass == null);
      return updateAdvancedControls.call(this);
    };

    MissionForm.prototype.advancedControlsVisible = function() {
      return $('#showAdvancedControls').text().indexOf('Hide') !== -1;
    };

    MissionForm.prototype.showAdvancedControls = function(show) {
      if (show) {
        $('#showAdvancedControls').text('Hide advanced settings...');
        return $('#advancedControls').slideDown();
      } else {
        $('#showAdvancedControls').text('Show advanced settings...');
        return $('#advancedControls').slideUp();
      }
    };

    MissionForm.prototype.adjustLatestDeparture = function() {
      if (!this.advancedControlsVisible()) {
        return updateAdvancedControls.call(this);
      } else {
        if (+$('#earliestDepartureYear').val() > +$('#latestDepartureYear').val()) {
          $('#latestDepartureYear').val($('#earliestDepartureYear').val());
        }
        if (+$('#earliestDepartureYear').val() === +$('#latestDepartureYear').val()) {
          if (+$('#earliestDepartureDay').val() >= +$('#latestDepartureDay').val()) {
            return $('#latestDepartureDay').val(+$('#earliestDepartureDay').val() + 1);
          }
        }
      }
    };

    MissionForm.prototype.setTimeOfFlight = function(shortest, longest, preserveShortest) {
      if (preserveShortest == null) {
        preserveShortest = true;
      }
      if (shortest <= 0) {
        shortest = 1;
      }
      if (longest <= 0) {
        longest = 2;
      }
      if (shortest >= longest) {
        if (preserveShortest) {
          longest = shortest + 1;
        } else if (longest > 1) {
          shortest = longest - 1;
        } else {
          shortest = longest / 2;
        }
      }
      $('#shortestTimeOfFlight').val(shortest);
      return $('#longestTimeOfFlight').val(longest);
    };

    MissionForm.prototype.mission = function() {
      var destination, earliestDeparture, finalOrbit, finalOrbitalVelocity, initialOrbit, initialOrbitalVelocity, latestDeparture, mission, origin, shortestTimeOfFlight, transferType, xScale, yScale;
      origin = this.origin();
      destination = this.destination();
      initialOrbit = $('#initialOrbit').val().trim();
      finalOrbit = $('#finalOrbit').val().trim();
      transferType = $('#transferTypeSelect').val();
      if ((origin.mass == null) || +initialOrbit === 0) {
        initialOrbitalVelocity = 0;
      } else {
        initialOrbitalVelocity = origin.circularOrbitVelocity(initialOrbit * 1e3);
      }
      if ($('#noInsertionBurnCheckbox').is(":checked")) {
        finalOrbitalVelocity = null;
      } else if ((destination.mass == null) || +finalOrbit === 0) {
        finalOrbitalVelocity = 0;
      } else {
        finalOrbitalVelocity = destination.circularOrbitVelocity(finalOrbit * 1e3);
      }
      earliestDeparture = KerbalTime.fromDate(+$('#earliestDepartureYear').val(), +$('#earliestDepartureDay').val()).t;
      latestDeparture = KerbalTime.fromDate(+$('#latestDepartureYear').val(), +$('#latestDepartureDay').val()).t;
      xScale = latestDeparture - earliestDeparture;
      shortestTimeOfFlight = KerbalTime.fromDuration(0, +$('#shortestTimeOfFlight').val()).t;
      yScale = KerbalTime.fromDuration(0, +$('#longestTimeOfFlight').val()).t - shortestTimeOfFlight;
      return mission = {
        transferType: transferType,
        originBody: origin,
        destinationBody: destination,
        initialOrbitalVelocity: initialOrbitalVelocity,
        finalOrbitalVelocity: finalOrbitalVelocity,
        earliestDeparture: earliestDeparture,
        shortestTimeOfFlight: shortestTimeOfFlight,
        xScale: xScale,
        yScale: yScale
      };
    };

    updateAdvancedControls = function() {
      var departureRange, destination, hohmannTransfer, hohmannTransferTime, maxDays, maxDeparture, minDays, minDeparture, origin, referenceBody, synodicPeriod;
      origin = this.origin();
      destination = this.destination();
      referenceBody = origin.orbit.referenceBody;
      hohmannTransfer = Orbit.fromApoapsisAndPeriapsis(referenceBody, destination.orbit.semiMajorAxis, origin.orbit.semiMajorAxis, 0, 0, 0, 0);
      hohmannTransferTime = hohmannTransfer.period() / 2;
      synodicPeriod = Math.abs(1 / (1 / destination.orbit.period() - 1 / origin.orbit.period()));
      departureRange = Math.min(2 * synodicPeriod, 2 * origin.orbit.period()) / KerbalTime.secondsPerDay();
      if (departureRange < 0.1) {
        departureRange = +departureRange.toFixed(2);
      } else if (departureRange < 1) {
        departureRange = +departureRange.toFixed(1);
      } else {
        departureRange = +departureRange.toFixed();
      }
      minDeparture = KerbalTime.fromDate($('#earliestDepartureYear').val(), $('#earliestDepartureDay').val()).t / KerbalTime.secondsPerDay();
      maxDeparture = minDeparture + departureRange;
      minDays = Math.max(hohmannTransferTime - destination.orbit.period(), hohmannTransferTime / 2) / KerbalTime.secondsPerDay();
      maxDays = minDays + Math.min(2 * destination.orbit.period(), hohmannTransferTime) / KerbalTime.secondsPerDay();
      minDays = minDays < 10 ? minDays.toFixed(2) : minDays.toFixed();
      maxDays = maxDays < 10 ? maxDays.toFixed(2) : maxDays.toFixed();
      $('#latestDepartureYear').val((maxDeparture / KerbalTime.daysPerYear | 0) + 1);
      $('#latestDepartureDay').val((maxDeparture % KerbalTime.daysPerYear) + 1);
      $('#shortestTimeOfFlight').val(minDays);
      $('#longestTimeOfFlight').val(maxDays);
      if (destination.mass != null) {
        return $('#finalOrbit').attr("disabled", $('#noInsertionBurnCheckbox').is(":checked"));
      }
    };

    return MissionForm;

  })();

  (typeof exports !== "undefined" && exports !== null ? exports : this).MissionForm = MissionForm;

}).call(this);
