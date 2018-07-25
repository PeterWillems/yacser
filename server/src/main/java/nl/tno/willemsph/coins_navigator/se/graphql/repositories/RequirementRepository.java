package nl.tno.willemsph.coins_navigator.se.graphql.repositories;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import nl.tno.willemsph.coins_navigator.se.SeService;
import nl.tno.willemsph.coins_navigator.se.graphql.models.Requirement;
import nl.tno.willemsph.coins_navigator.se.model.GetRequirement;
import nl.tno.willemsph.coins_navigator.se.model.PutRequirement;

@Component
public class RequirementRepository {

	@Autowired
	private SeService seService;

	public List<Requirement> getAllRequirements(int datasetId) throws IOException, URISyntaxException {
		List<Requirement> requirements = new ArrayList<>();
		List<GetRequirement> getRequirements = seService.getAllRequirements(datasetId);
		for (GetRequirement getRequirement : getRequirements) {
			Requirement requirement = new Requirement(datasetId, getRequirement.getUri().toString(), getRequirement.getLabel());
			requirements.add(requirement);
		}
		return requirements;
	}

	public void saveRequirement(Requirement requirement) throws URISyntaxException, IOException {
		GetRequirement getRequirement = seService.createRequirement(0);
		PutRequirement putRequirement = new PutRequirement();
		putRequirement.setUri(getRequirement.getUri());
		putRequirement.setLabel(requirement.getLabel());
		seService.updateRequirement(0, getRequirement.getLocalName(), putRequirement);
		requirement.setUri(putRequirement.getUri());
		requirement.setLabel(putRequirement.getLabel());
	}

	public Requirement findOne(int datasetId, String uri) throws URISyntaxException, IOException {
		String localName = uri.substring(uri.indexOf('#') + 1);
		GetRequirement requirement = seService.getRequirement(datasetId, localName);
		return new Requirement(datasetId, requirement.getUri().toString(), requirement.getLabel());
	}
}
