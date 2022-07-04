import EC2 from 'aws-sdk/clients/ec2';

export const listKops = ({ region }) => {
  return new Promise((resolve, reject) => {
    const ec2 = new EC2({ apiVersion: '2016-11-15', region });
    ec2.describeInstances({}, (err, data) => {
      if (err) {
        return reject(err);
      }

      const instances = [];
      // NOTE servers are randomly in different Reservations... would have done a reduce but this was simpler...
      for (let i = 0; i < data.Reservations.length; i++) {
        const reserve = data.Reservations[i];
        [].push.apply(
          instances,
          reserve.Instances.map(
            ({ Tags, InstanceType, PublicIpAddress, PrivateIpAddress }) => ({
              name: Tags.find((tag) => tag.Key === 'Name').Value,
              size: InstanceType,
              public: PublicIpAddress,
              private: PrivateIpAddress
            })
          )
        );
      }

      const nodes = instances.filter((inst) => inst.name.match(/^nodes/));
      const traefik = instances.filter((inst) => inst.name.match(/^traefik$/));
      const master = instances.filter((inst) => inst.name.match(/^master/));
      const privateIps = nodes.map((node) => node.private).filter(Boolean);
      resolve({ nodes, traefik, master, privateIps });
    });
  });
};
