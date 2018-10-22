package nl.tno.willemsph.coins_navigator.se.graphql.repositories;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import nl.tno.willemsph.coins_navigator.se.SeService;
import nl.tno.willemsph.coins_navigator.se.graphql.models.CoinsObjectInput;
import nl.tno.willemsph.coins_navigator.se.graphql.models.SystemInterface;
import nl.tno.willemsph.coins_navigator.se.graphql.models.SystemInterfaceInput;
import nl.tno.willemsph.coins_navigator.se.model.CoinsObject;
import nl.tno.willemsph.coins_navigator.se.model.GetSystemInterface;
import nl.tno.willemsph.coins_navigator.se.model.PutSystemInterface;

@Component
public class SystemInterfaceRepository {

	@Autowired
	private SeService seService;

	public List<SystemInterface> getAllSystemInterfaces(int datasetId) throws IOException, URISyntaxException {
		List<SystemInterface> systemInterfaces = new ArrayList<>();
		List<GetSystemInterface> getSystemInterfaces = seService.getAllSystemInterfaces(datasetId);
		for (GetSystemInterface getSystemInterface : getSystemInterfaces) {
			SystemInterface systemInterface = new SystemInterface(datasetId, getSystemInterface.getUri().toString(),
					getSystemInterface.getLabel());
			systemInterfaces.add(systemInterface);
		}
		return systemInterfaces;
	}

	public void saveSystemInterface(SystemInterface systemInterface) throws URISyntaxException, IOException {
		GetSystemInterface getSystemInterface = seService.createSystemInterface(systemInterface.getDatasetId());
		PutSystemInterface putSystemInterface = new PutSystemInterface();
		putSystemInterface.setUri(getSystemInterface.getUri());
		putSystemInterface.setLabel(getSystemInterface.getLabel());
		seService.updateSystemInterface(systemInterface.getDatasetId(), getSystemInterface.getLocalName(),
				putSystemInterface);
		systemInterface.setUri(putSystemInterface.getUri());
		systemInterface.setLabel(putSystemInterface.getLabel());
	}

	public SystemInterface findOne(int datasetId, String uri) throws URISyntaxException, IOException {
		String localName = uri.substring(uri.indexOf('#') + 1);
		GetSystemInterface systemInterface = seService.getSystemInterface(datasetId, localName);
		return new SystemInterface(datasetId, systemInterface.getUri().toString(), systemInterface.getLabel());
	}

	public SystemInterface updateOne(SystemInterfaceInput systemInterfaceInput, CoinsObjectInput coinsObjectInput)
			throws URISyntaxException, IOException {
		URI uri = new URI(systemInterfaceInput.getUri());
		GetSystemInterface getSystemInterface = seService.getSystemInterface(systemInterfaceInput.getDatasetId(),
				uri.getFragment());
		PutSystemInterface putSystemInterface = new PutSystemInterface();
		putSystemInterface.setUri(getSystemInterface.getUri());
		putSystemInterface.setLabel(systemInterfaceInput.getLabel());
		if (systemInterfaceInput.getAssembly() != null) {
			putSystemInterface.setAssembly(new URI(systemInterfaceInput.getAssembly()));
		}
		if (systemInterfaceInput.getParts() != null) {
			List<URI> parts = new ArrayList<>();
			for (String part : systemInterfaceInput.getParts()) {
				parts.add(new URI(part));
			}
			putSystemInterface.setParts(parts);
		}
		if (systemInterfaceInput.getSystemSlot0() != null) {
			putSystemInterface.setSystemSlot0(new URI(systemInterfaceInput.getSystemSlot0()));
		}
		if (systemInterfaceInput.getSystemSlot1() != null) {
			putSystemInterface.setSystemSlot1(new URI(systemInterfaceInput.getSystemSlot1()));
		}
		if (systemInterfaceInput.getRequirements() != null) {
			List<URI> requirements = new ArrayList<>();
			for (String requirement : systemInterfaceInput.getRequirements()) {
				requirements.add(new URI(requirement));
			}
			putSystemInterface.setRequirements(requirements);
		}
		if (coinsObjectInput != null) {
			putSystemInterface.setCoinsObject(new CoinsObject(coinsObjectInput.getName(), coinsObjectInput.getUserID(),
					coinsObjectInput.getDescription(), coinsObjectInput.getCreationDate(), null));
		}
		
		GetSystemInterface updatedSystemInterface = seService.updateSystemInterface(systemInterfaceInput.getDatasetId(),
				getSystemInterface.getLocalName(), putSystemInterface);
		return new SystemInterface(systemInterfaceInput.getDatasetId(), updatedSystemInterface.getUri().toString(),
				updatedSystemInterface.getLabel());
	}

	public SystemInterface deleteOne(int datasetId, String uri) throws URISyntaxException, IOException {
		String systemInterfaceLocalName = (new URI(uri)).getFragment();
		GetSystemInterface getSystemInterface = seService.getSystemInterface(datasetId, systemInterfaceLocalName);
		SystemInterface systemInterface = new SystemInterface(datasetId, uri, getSystemInterface.getLabel());
		seService.deleteSystemInterface(datasetId, systemInterfaceLocalName);
		return systemInterface;
	}
}
