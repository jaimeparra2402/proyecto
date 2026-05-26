package es.ual.backend_java.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Data
@Document(collection = "players") 
public class Player {
    @Id
    private String id;
    private String name;
    private String team;
    private String league;
    private String position;
    private String imageUrl;
    private Stats stats = new Stats();
    private Date createdAt = new Date();
    
    public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getTeam() {
		return team;
	}

	public void setTeam(String team) {
		this.team = team;
	}

	public String getLeague() {
		return league;
	}

	public void setLeague(String league) {
		this.league = league;
	}

	public String getPosition() {
		return position;
	}

	public void setPosition(String position) {
		this.position = position;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}

	public Stats getStats() {
		return stats;
	}

	public void setStats(Stats stats) {
		this.stats = stats;
	}

	public Date getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}

	public List<Map<String, Object>> getComments() {
		return comments;
	}

	public void setComments(List<Map<String, Object>> comments) {
		this.comments = comments;
	}

	private List<Map<String, Object>> comments; 
}