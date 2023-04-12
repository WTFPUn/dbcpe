import { MongoClient, ServerApiVersion } from "mongodb";
import { jwtdecode } from "@/utils/verify";
import SHA256 from "crypto-js/sha256";
import { decode } from "jsonwebtoken";

export default async function updatePassword(req, res) {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  const token = req.headers["auth-token"];
  const { clientPassword, clientNewPassword } = req.body;
  const decoded = jwtdecode(token);
  const { account_id } = decoded || {};

  console.log("decode: ", decoded);
  console.log("clientpass : ", clientPassword);
  console.log("clientNew :  ", clientNewPassword);

  if (req.method !== "PUT") {
    return res
      .status(405)
      .json({ message: "Method not allowed", success: false });
  }

  const cryptClientPassword = SHA256(clientPassword + account_id).toString();

  try {
    await client.connect();
    console.log("Connected to database");
    const collection = client
      .db("HotelManage")
      .collection("personal_information");

    const profile = await collection.findOne(
      { account_id: account_id },
      { projection: { password: 1 } }
    );
    console.log("profile : ", profile);
    console.log("profile.password", profile.password);
    console.log("cryptClientPassword", cryptClientPassword);

    if (profile.password === cryptClientPassword) {
      const cryptClientNewPassword = SHA256(
        clientNewPassword + account_id
      ).toString();

      const statusUpdatePass = await collection.updateOne(
        { account_id: account_id },
        {
          $set: {
            password: cryptClientNewPassword,
          },
        }
      );

      return res
        .status(200)
        .json({ message: "Update password success", success: true });
    } else {
      return res
        .status(404)
        .json({ message: "Update password fail", success: false });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, success: false });
  } finally {
    await client.close();
  }
}
