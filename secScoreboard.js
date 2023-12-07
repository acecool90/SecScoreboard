async function fetchDataForTeamAndWeek(team, week) {
    try {
      const encodedTeam = encodeURIComponent(team); 
      const response = await fetch(`http://localhost:3008/api/games?team=${encodedTeam}&week=${week}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  }
  
  function formatDate(iso8601String) {
    const date = new Date(iso8601String);
    if (!isNaN(date)) {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        };
        return date.toLocaleString('en-US', options);
    } else {
        return "Invalid date string";
    }
}

  async function fetchGameDataForAllTeams(week) {
    const teams = [
      "Georgia", "Alabama", "Ole Miss", "Mississippi State",
      "Florida", "South Carolina", "Auburn", "Kentucky",
      "Vanderbilt", "Tennessee", "Arkansas", "Texas A%26M",
      "Missouri", "LSU"
    ];
  
    const teamData = {};
  
    for (const team of teams) {
      const data = await fetchDataForTeamAndWeek(team, week);
      teamData[team] = data;
    }
  
    return teamData;
  }
  
  function displayGameDataForAllTeams(teamData) {
    const teamGameDetails = document.getElementById("teamGameDetails");
    teamGameDetails.innerHTML = "";
  
    for (const team in teamData) {
      const games = teamData[team];
  
      const teamContainer = document.createElement("div");
      teamContainer.classList.add("team-container");
  
      const teamHeader = document.createElement("h2");
      teamHeader.textContent = decodeURIComponent(team);
      teamHeader.classList.add("team-header");
      teamContainer.appendChild(teamHeader);
  
      if (games && games.length > 0) {
        games.forEach(game => {
          const gameDetails = document.createElement("div");
          gameDetails.classList.add("game-details");
  
      gameDetails.innerHTML += `
                <h2>${game.home_team} vs ${game.away_team}</h2>
                <p>Week: ${game.week}</p>
                <p>Season: ${game.season}</p>
                <p>Season Type: ${game.season_type}</p>
                <p>Date: ${formatDate(game.start_date)}</p>
                <p>Start Time TBD: ${game.start_time_tbd ? "Yes" : "No"}</p>
                <p>Completed: ${game.completed ? "Yes" : "No"}</p>
                <p>Neutral Site: ${game.neutral_site ? "Yes" : "No"}</p>
                <p>Conference Game: ${game.conference_game ? "Yes" : "No"}</p>
                <p>Attendance: ${game.attendance ?? 0}</p>
                <p>Venue: ${game.venue}</p>
                <p>Home Points: ${game.home_points ?? "N/A"}</p>
                <p>Away Points: ${game.away_points ?? "N/A"}</p>
                <p>Home Line Scores: ${game.home_line_scores ? game.home_line_scores.join(", ") : "N/A"}</p>
                <p>Away Line Scores: ${game.away_line_scores ? game.away_line_scores.join(", ") : "N/A"}</p>
                <p>Home Pregame Elo: ${game.home_pregame_elo ?? "N/A"}</p>
                <p>Home Postgame Elo: ${game.home_postgame_elo ?? "N/A"}</p>
                <p>Away Pregame Elo: ${game.away_pregame_elo ?? "N/A"}</p>
                <p>Away Postgame Elo: ${game.away_postgame_elo ?? "N/A"}</p>
                <p>Highlights: ${game.highlights ? game.highlights.join(", ") : "N/A"}</p>
                

              `;

              teamContainer.appendChild(gameDetails);
      });
    } else {
      const noData = document.createElement("p");
      noData.textContent = `No data available for ${team} because of Bye Week`;
      teamContainer.appendChild(noData);
    }

    teamGameDetails.appendChild(teamContainer);
  }
}

document.getElementById("weekSelect").addEventListener("change", async function () {
    const selectedWeek = this.value;
    const teamData = await fetchGameDataForAllTeams(selectedWeek);
    displayGameDataForAllTeams(teamData);
  });
  
  fetchGameDataForAllTeams(1)
    .then(teamData => {
      displayGameDataForAllTeams(teamData);
    });