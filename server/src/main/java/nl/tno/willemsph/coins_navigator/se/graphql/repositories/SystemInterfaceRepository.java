package nl.tno.willemsph.coins_navigator.se.graphql.repositories;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import nl.tno.willemsph.coins_navigator.se.SeService;
import nl.tno.willemsph.coins_navigator.se.graphql.models.SystemInterface;
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
		putSystemInterface.setLabel(systemInterface.getLabel());
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
}
