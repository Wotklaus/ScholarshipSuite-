export class CreateContractDto {
  userId: string;          // ID del usuario
  templateId: string;      // ID de la plantilla
  scholarshipPeriod: Date; // Periodo de la beca
  officialNumber: string;  // Número oficial del contrato
  budgetItem: string;      // Detalle presupuestario
}