import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Estilos do documento em pontos (A4)
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 9,
    fontFamily: 'Helvetica',
  },
  header: {
    textAlign: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
  },
  subtitle: {
    fontSize: 8,
    color: '#444',
    marginTop: 2,
  },
  box: {
    border: '1px solid #000',
    padding: 6,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  col: {
    flex: 1,
  },
  label: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    borderBottom: '1px solid #000',
    padding: 4,
    fontFamily: 'Helvetica-Bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #ddd',
    padding: 4,
  },
  colNum: { width: '8%' },
  colNome: { width: '45%' },
  colTipo: { width: '15%' },
  colDoc: { width: '32%' },
});

export function DocumentoManifesto({ dadosViagem, passageiros }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.title}>MANIFESTO DE VIAGEM - RELAÇÃO DE PASSAGEIROS</Text>
          <Text style={styles.subtitle}>Documento de Porte Obrigatório para Fiscalização (ANTT / DER)</Text>
        </View>

        {/* Bloco 1: Veículo e Motorista */}
        <View style={styles.box}>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text><Text style={styles.label}>VIAGEM: </Text>{dadosViagem.nomeViagem}</Text>
            </View>
            <View style={styles.col}>
              <Text><Text style={styles.label}>DATA: </Text>{dadosViagem.dataViagem}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text><Text style={styles.label}>PLACA: </Text>{dadosViagem.placa}</Text>
            </View>
            <View style={styles.col}>
              <Text><Text style={styles.label}>MOTORISTA: </Text>{dadosViagem.motorista}</Text>
            </View>
          </View>
        </View>

        {/* Bloco 2: Tabela de Passageiros */}
        <View style={{ border: '1px solid #000', marginTop: 5 }}>
          <View style={styles.tableHeader}>
            <Text style={styles.colNum}>Nº</Text>
            <Text style={styles.colNome}>NOME COMPLETO</Text>
            <Text style={styles.colTipo}>DOC</Text>
            <Text style={styles.colDoc}>NÚMERO</Text>
          </View>

          {passageiros.map((p, idx) => (
            <View key={p.id || idx} style={styles.tableRow}>
              <Text style={styles.colNum}>{String(idx + 1).padStart(2, '0')}</Text>
              <Text style={styles.colNome}>{p.nome.toUpperCase()}</Text>
              <Text style={styles.colTipo}>CPF/RG</Text>
              <Text style={styles.colDoc}>{p.cpf || p.rg || p.doc}</Text>
            </View>
          ))}
        </View>

        {/* Rodapé para Assinatura */}
        <View style={{ marginTop: 40, flexDirection: 'row', justifyContent: 'space-around' }}>
          <View style={{ width: 200, borderTop: '1px solid #000', textAlign: 'center', paddingTop: 4 }}>
            <Text style={{ fontSize: 8 }}>Assinatura do Responsável</Text>
          </View>
          <View style={{ width: 200, borderTop: '1px solid #000', textAlign: 'center', paddingTop: 4 }}>
            <Text style={{ fontSize: 8 }}>Visto da Fiscalização</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}