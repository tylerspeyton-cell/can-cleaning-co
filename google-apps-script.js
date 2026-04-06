// ============================================================
//  Can Cleaning Co. — Google Apps Script
//  Paste this entire file into your Google Apps Script editor
//  then deploy as a Web App (see SETUP.md for instructions)
// ============================================================

const NOTIFY_EMAIL   = 'info@can-cleaning-co.com'; // Change to your real email
const ADMIN_KEY      = 'Yavauo2017';
const SHEET_NAME     = 'Bookings';
const START_ADDRESS  = '6162 Maple Ave, Dallas, TX 75235'; // Starting point for all daily routes

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getSheet();

    sheet.appendRow([
      new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' }),
      data.name           || '',
      data.phone          || '',
      data.email          || '',
      data.address        || '',
      data.city           || '',
      data.zip            || '',
      data.cans           || '',
      data.preferred_date || '',
      data.service_type   || '',
      data.notes          || '',
    ]);

    // Build route for all stops on this date (including the one just added)
    const routeUrl = buildRouteForDate(sheet, data.preferred_date);

    // Email notification
    const subject = 'New Booking — ' + (data.service_type || '') + ' — ' + (data.name || '');
    const body = [
      'New booking received!',
      '',
      'Name:     ' + data.name,
      'Phone:    ' + data.phone,
      'Email:    ' + (data.email || 'not provided'),
      'Address:  ' + data.address + ', ' + data.city + ', TX ' + data.zip,
      'Cans:     ' + data.cans,
      'Date:     ' + data.preferred_date,
      'Service:  ' + data.service_type,
      'Notes:    ' + (data.notes || 'None'),
      '',
      '─── Route for ' + data.preferred_date + ' ───',
      routeUrl
        ? 'Open in Google Maps: ' + routeUrl
        : 'Only stop on this date so far — no multi-stop route yet.',
    ].join('\n');

    MailApp.sendEmail(NOTIFY_EMAIL, subject, body);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  if (!e.parameter.key || e.parameter.key !== ADMIN_KEY) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: 'Unauthorized' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const sheet = getSheet();
  const rows  = sheet.getDataRange().getValues();
  if (rows.length <= 1) {
    return ContentService
      .createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const bookings = rows.slice(1).map(row => ({
    Timestamp:        row[0],
    Name:             row[1],
    Phone:            row[2],
    Email:            row[3],
    Address:          row[4],
    City:             row[5],
    ZIP:              row[6],
    Cans:             row[7],
    'Preferred Date': row[8],
    'Service Type':   row[9],
    Notes:            row[10],
  }));

  return ContentService
    .createTextOutput(JSON.stringify(bookings))
    .setMimeType(ContentService.MimeType.JSON);
}

// Returns an optimized Google Maps multi-stop URL for all bookings on a given date.
// Returns null if fewer than 2 stops exist.
function buildRouteForDate(sheet, targetDate) {
  const rows = sheet.getDataRange().getValues();
  // Columns: 0=Timestamp,1=Name,2=Phone,3=Email,4=Address,5=City,6=ZIP,
  //          7=Cans,8=Preferred Date,9=Service Type,10=Notes
  var stops = [];
  for (var i = 1; i < rows.length; i++) {
    var rowDate = String(rows[i][8]).trim();
    if (rowDate === String(targetDate).trim()) {
      var addr = [rows[i][4], rows[i][5], 'TX', rows[i][6]].filter(Boolean).join(', ');
      if (addr) stops.push(addr);
    }
  }

  if (stops.length < 2) return null;

  // Prepend home base if set
  var origin = START_ADDRESS || stops[0];
  var destinations = START_ADDRESS ? stops : stops.slice(1);
  var finalStop = destinations[destinations.length - 1];
  var waypoints = destinations.slice(0, destinations.length - 1);

  // Optimize waypoint order using Apps Script's built-in Maps service
  try {
    if (waypoints.length > 0) {
      var finder = Maps.newDirectionFinder()
        .setOrigin(origin)
        .setDestination(finalStop)
        .setOptimizeWaypoints(true);

      waypoints.forEach(function(wp) { finder.addWaypoint(wp); });

      var result = finder.getDirections();
      var order  = result.routes[0].waypoint_order;

      // Rebuild stops in optimized order
      var optimizedWaypoints = order.map(function(idx) { return waypoints[idx]; });
      stops = [origin].concat(optimizedWaypoints).concat([finalStop]);
    } else {
      stops = [origin, finalStop];
    }
  } catch (err) {
    // Optimization failed — fall back to original order
    stops = [origin].concat(waypoints).concat([finalStop]);
  }

  var encoded = stops.map(function(s) { return encodeURIComponent(s); });
  return 'https://www.google.com/maps/dir/' + encoded.join('/');
}

function getSheet() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  let   sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'Timestamp', 'Name', 'Phone', 'Email',
      'Address', 'City', 'ZIP', 'Cans',
      'Preferred Date', 'Service Type', 'Notes'
    ]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}
